import React from "react";
import _ from "lodash";
import { compose, withState, withHandlers, lifecycle } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import Navigator from "components/Navigator";
import withRouterParams from "helpers/withRouterParams";

import { runCode } from "blondie-platform-common";
import withConfiguration from "helpers/withConfiguration";
import { orderBy } from "constants/resources/entity";

const buildSectionsByOrder = ({ entities = [], platformId }) => {
  const orderedEntities = _(entities)
    .orderBy(entity => orderBy({ ...entity }))
    .value();

  const { groupedEntities, subEntities } = _(orderedEntities).reduce(
    ({ groupedEntities, subEntities, sectionName }, entity) => {
      if (sectionName === entity.section) {
        subEntities.push(entity);
      } else {
        if (subEntities.length) groupedEntities.push(subEntities);
        sectionName = entity.section;
        subEntities = [entity];
      }
      return { groupedEntities, subEntities, sectionName };
    },
    { groupedEntities: [], subEntities: [], sectionName: "" }
  );
  if (subEntities && subEntities.length > 0) groupedEntities.push(subEntities);

  return groupedEntities.map(child => {
    const sectionName = child[0].section;
    return {
      section: sectionName,
      items: child.map(entity => ({
        id: entity.pluralName,
        icon: entity.icon,
        color: entity.color,
        route: "resources",
        params: { platformId, entityId: entity.id, view: 'my' },
        path: `/platforms/${platformId}/data/${entity.id}`,
        visible: !!entity.visible
      }))
    };
  });
};
// [
//   {
//     id: "View",
//     children: (entities || []).map(entity => ({
//       id: entity.pluralName,
//       route: "resources",
//       params: { platformId, entityId: entity.id },
//       path: `/platforms/${platformId}/data/${entity.id}`
//     }))
//   },
//   {
//     id: "Develop",
//     children: !platformId
//       ? []
//       : [
//           {
//             id: "Entities",
//             icon: <ClassIcon />,
//             route: "entities",
//             params: { platformId },
//             path: `/platforms/${platformId}/entities`
//           },
//           {
//             id: "Fields",
//             icon: <DescriptionIcon />,
//             route: "fields",
//             params: { platformId },
//             path: `/platforms/${platformId}/fields`
//           },
//           {
//             id: "Types",
//             icon: <TollIcon />,
//             route: "types",
//             params: { platformId },
//             path: `/platforms/${platformId}/types`
//           },
//           {
//             id: "Relations",
//             icon: <DeviceHubIcon />,
//             route: "relations",
//             params: { platformId },
//             path: `/platforms/${platformId}/relations`
//           },
//           {
//             id: "Actions",
//             icon: <OfflineBoltIcon />,
//             route: "actions",
//             params: { platformId },
//             path: `/platforms/${platformId}/actions`
//           },
//           {
//             id: "Views",
//             icon: <PageviewIcon />,
//             route: "views",
//             params: { platformId },
//             path: `/platforms/${platformId}/views`
//           },
//           {
//             id: "Widgets",
//             icon: <WidgetsIcon />,
//             route: "widgets",
//             params: { platformId },
//             path: `/platforms/${platformId}/widgets`
//           },
//           {
//             id: "Validators",
//             icon: <ErrorOutlineIcon />,
//             route: "validators",
//             params: { platformId },
//             path: `/platforms/${platformId}/validators`
//           },
//           {
//             id: "Permissions",
//             icon: <SecurityIcon />,
//             route: "permissions",
//             params: { platformId },
//             path: `/platforms/${platformId}/permissions`
//           },
//           {
//             id: "Sources",
//             icon: <CompareArrowsIcon />,
//             route: "sourceTypes",
//             params: { platformId },
//             path: `/platforms/${platformId}/sources`
//           },
//           { id: "Mutators", icon: <MergeTypeIcon /> }
//         ]
//   },
//   {
//     id: "Design",
//     children: !platformId
//       ? []
//       : [
//           {
//             id: "Design",
//             icon: <BrushIcon />,
//             route: "design",
//             params: { platformId },
//             path: `/platforms/${platformId}/design`
//           },
//           { id: "Apps", icon: <DeveloperBoardIcon />, disabled: true },
//           { id: "Pages", icon: <DesktopWindowsIcon />, disabled: true },
//           { id: "Containers", icon: <CropFreeIcon />, disabled: true },
//           { id: "Selectors", icon: <ImageAspectRatioIcon />, disabled: true },
//           { id: "Components", icon: <ViewCompactIcon />, disabled: true }
//         ]
//   }
// ];

const mapStateToProps = state => ({
  auth: state.firebase.auth
});

export default compose(
  withConfiguration,
  withFirestore,
  withRouterParams("platformId", "entityId"),
  connect(mapStateToProps),
  withState("sections", "setSections"),
  connect((state, props) => ({
    entities: props.configuration.entities.ordered,
    entitiesLoaded: props.configuration.entities.isLoaded
  })),
  withHandlers({
    fetchSections: ({
      auth,
      configuration,
      platformId,
      sections,
      setSections,
    }) => async () => {
      if (!configuration.entities.isLoaded) return;
      if (sections) return;

      const rawSections = buildSectionsByOrder({
        entities: configuration.entities.ordered,
        platformId
      });

      if (configuration.permissions.filtered.resource.length === 0) {
        setSections(rawSections);
        return;
      }

      const sections = await Promise.all(
        rawSections.map(async ({ section, items: rawItems }) => {
          const items = await Promise.all(
            rawItems.map(async child => {
              const results = await Promise.all(
                configuration.permissions.filtered.resource.map(
                  async permission => {
                    if (
                      !permission.rule ||
                      _.isEmpty(permission.rule[permission.rule.mode])
                    ) {
                      return true;
                    }

                    const result = await runCode(permission.rule, {
                      auth,
                      this: { pluralName: child.id }
                    });

                    return result;
                  }
                )
              );

              if (!_.some(results, r => !r)) {
                return child;
              }
            })
          );

          const filteredItems = _.filter(items);
          return { section, items: filteredItems };
        })
      );

      const filteredSections = _.filter(
        sections,
        ({ items }) => items.length > 0
      );

      setSections(filteredSections);
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchSections();
    },
    componentDidUpdate() {
      if (!this.props.sections) {
        this.props.fetchSections();
      }
    }
  })
)(Navigator);

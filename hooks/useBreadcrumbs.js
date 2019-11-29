import React, { useEffect, useState } from "react";
import _ from "lodash";
import useRecordTitles, { calculateTitle } from "./useRecordTitles";
import { Router } from "../routes";
import useConfiguration from "./useConfiguration";
import useRouteParams from "./useRouteParams";
import goToBreadcrumbPart from '../helpers/goToBreadcrumbPart';

export default function useBreadcrumbs({ firestore, entity }) {
  const [breadcrumbsParts, setBreadcrumbsParts] = useState([]);
  const { platformId, view, path, id } = useRouteParams();
  const configuration = useConfiguration();
  const recordTitles = useRecordTitles(entity.id, id);

  useEffect(() => {
    async function fn() {
      if (path) {
        const ids = path.split("~");

        let parts = await Promise.all(
          ids.map(async id => {
            const doc = await firestore
              .collection("records")
              .doc(id)
              .get();
            const record = { ...doc.data(), id: doc.id };
            const entity = configuration.entities.data[record.entity.id];
            const title = await calculateTitle(entity.primary, {
              record,
              firestore,
              entityId: entity.id
            });

            return {
              record,
              entity,
              title
            };
          })
        );

        parts = parts.reduce((acc, { entity, record, title }, index) => {
          if (index === 0) {
            acc.push({
              title: entity.pluralName,
              icon: entity.icon,
              onClick: () =>
                Router.pushRoute("resources", {
                  platformId,
                  entityId: entity.id,
                  view
                })
            });
          }

          acc.push({
            title,
            icon: entity.icon,
            onClick: () => goToBreadcrumbPart({ path, platformId, entityId: entity.id, recordId: record.id, view })
          });

          return acc;
        }, []);

        setBreadcrumbsParts(parts);
      } else {
        setBreadcrumbsParts([
          {
            title: entity.pluralName,
            icon: entity.icon,
            onClick: () =>
              Router.pushRoute("resources", {
                platformId,
                entityId: entity.id,
                view
              })
          }
        ]);
      }
    }

    setBreadcrumbsParts([]);

    fn();
  }, [path]);

  const lastNodeTitle = _.isEmpty(recordTitles) ? "..." : recordTitles.primary;

  return { breadcrumbsParts, lastNodeTitle };
}

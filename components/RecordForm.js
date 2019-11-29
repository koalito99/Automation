import _ from 'lodash';
import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Field from "components/Field";

import useEntity from '../hooks/useEntity';
import useRouteParams from "../hooks/useRouteParams";
import { Router } from "../routes";

const useStyles = makeStyles(theme => ({
  summary: {
    backgroundColor: theme.palette.grey[100],
    minHeight: 48
  },
  expanded: {
    margin: "10px 0"
  },
}));

function RecordForm(props) {
  const classes = useStyles();
  const { entityId, editMode = true, recordId = "new", onSave, fields } = props;
  const entity = useEntity(entityId);
  const [{selectedSection, selectedIndex}, setSelected] = useState({selectedSection: 0, selectedIndex: 0});
  const { platformId, id, view, path } = useRouteParams();
  const onEdit = useCallback(() => Router.pushRoute("resourceEdit", { platformId, entityId, id, view, path }), [platformId, entityId, id, view, path]);
  const onFieldClick = useCallback((sectionIndex, index) => {
    setSelected({selectedSection: sectionIndex, selectedIndex: index})
    if (!editMode) onEdit()
  })

  const sections = useMemo(() => {
    const orderedFormViewFields = fields ? fields : entity.fields.filtered.form;
    const groupedFormViewFields = _.groupBy(orderedFormViewFields, field => field.section || "");

    return _(groupedFormViewFields)
      .keys()
      .map(section => {
        const fields = _(orderedFormViewFields)
          .filter(s => (s.section || "") === section)
          .orderBy(field => parseInt(field.order))
          .value();

        return {
          section,
          fields,
          order: Math.min(...fields.map(f => parseInt(f.order)).filter(f => !!f))
        };
      })
      .filter(section => section.fields && section.fields.length > 0)
      .orderBy("order")
      .value();
  }, [entityId]);

  return (
    <form onSubmit={onSave} noValidate autoComplete="off">
      {sections.map((section, sectionIndex) => {
        return (
          <ExpansionPanel
            key={sectionIndex}
            elevation={0}
            defaultExpanded
            classes={{
              expanded: classes.expanded
            }}
          >
            {section.section ? (
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.summary}
              >
                <Typography variant="subtitle2">{section.section}</Typography>
              </ExpansionPanelSummary>
            ) : (
              undefined
            )}
            <ExpansionPanelDetails>
              <Grid container spacing={1}>
                {section.fields.map((field, index) => {
                  return (
                    <Grid
                      key={field.id}
                      item
                      xs={(field.xs && parseInt(field.xs)) || 12}
                      sm={field.sm && parseInt(field.sm)}
                      md={field.md && parseInt(field.md)}
                      lg={field.lg && parseInt(field.lg)}
                      xl={field.xl && parseInt(field.xl)}
                    >
                      <Field
                        autoFocus={sectionIndex === selectedSection && index === selectedIndex}
                        mode={editMode ? "edit" : "view"}
                        fieldId={field.id}
                        readOnly={field.readOnly}
                        defaultValue={field.defaultValue}
                        {...{ entityId, recordId }}
                        onClick={() => onFieldClick(sectionIndex, index)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </form>
  );
}

RecordForm.propTypes = {
  entityId: PropTypes.string.isRequired,
  recordId: PropTypes.string,
  editMode: PropTypes.bool,
  onSave: PropTypes.func.isRequired
};

export default RecordForm;

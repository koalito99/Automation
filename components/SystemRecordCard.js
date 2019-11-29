import React, { useMemo } from 'react';
import _ from 'lodash';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ResourceConfig from '../constants/resources';
import { makeStyles, Typography } from '@material-ui/core';
import { Highlight } from "react-instantsearch-dom";
import CardActionArea from '@material-ui/core/CardActionArea';
import { Link } from '../routes';
import useRouteParams from '../hooks/useRouteParams';

const useStyles = makeStyles(theme => ({
  actionArea: {
    minHeight: "150px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyItems: "flex-start",
    justifyContent: "flex-start",
    color: "initial",
    fontSize: theme.fontSize
  },
  container: {
    "& .ais-Highlight-highlighted": {
      fontStyle: "normal",
      backgroundColor: "yellow"
    }
  },
  anchor: {
    textDecoration: "none",
  }
}));

export default function SystemRecordCard({ item, type }) {
  const classes = useStyles();
  const config = ResourceConfig[type];
  const { platformId } = useRouteParams();

  const content = useMemo(() => {
    const data = config.schema.map((fieldDescription) => {
      const fieldName = fieldDescription.name;

      if (!fieldDescription.skipList && _.has(item, fieldName)) {
        return (
          <div key={fieldName} className={classes.container}>
            <span>
              <Typography
                variant="subtitle2"
                color="textSecondary"
              >
                {fieldName}:
              </Typography>
              <Typography variant="subtitle2">
                {
                  item._highlightResult && item._highlightResult[fieldName]
                    ? <Highlight hit={item} attribute={fieldName} />
                    : item[fieldName]
                }
              </Typography>
            </span>
          </div>
        );
      }
    });

    return data.filter(item => !!item);
  }, [item]);

  return (
    <Card className={classes.card}>
      <Link route={type} params={{ ...item, platformId, id: item.objectID }}>
        <a className={classes.anchor}>
          <CardActionArea className={classes.actionArea}>
            <CardContent>
              {content}
            </CardContent>
          </CardActionArea>
        </a>
      </Link>
    </Card>
  );
}

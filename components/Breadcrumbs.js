import _ from "lodash";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Router } from "../routes";
import HomeIcon from "@material-ui/icons/Home";
import Icon from "./Icon";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import React from "react";
import { withStyles } from "@material-ui/core";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import useFirestore from "../hooks/useFirestore";
import useRouteParams from "../hooks/useRouteParams";
import useEntity from "../hooks/useEntity";

const styles = theme => ({
  breadcrumbIcon: {
    marginTop: 2,
    marginRight: theme.spacing(0.5),
    width: 16,
    height: 16,
    color: "white"
  },
  link: {
    display: "flex",
    color: "white",
    cursor: "pointer"
  },
  lastLink: {
    display: "flex",
    color: "white"
  },
  separator: {
    color: "white"
  }
});

function BreadcrumbsComponent({ classes }) {
  const firestore = useFirestore();
  const { platformId, entityId, view, path } = useRouteParams();
  const entity = useEntity(entityId);
  const { breadcrumbsParts, lastNodeTitle } = useBreadcrumbs({
    path,
    firestore,
    entity
  });

  if (!breadcrumbsParts || _.isUndefined(lastNodeTitle)) return null;

  return (
    <Grid item xs>
      <Breadcrumbs
        aria-label="Breadcrumb"
        maxItems={3}
        classes={{ separator: classes.separator }}
      >
        {/* <Link
          onClick={() => Router.pushRoute("platform", { platformId })}
          variant="body2"
          className={classes.link}
        >
          <HomeIcon className={classes.breadcrumbIcon} />
          Platform
        </Link> */}
        {breadcrumbsParts.map(({ icon, title, onClick }, index) => (
          <Link key={index} onClick={onClick} variant="body2" className={classes.link}>
            <Icon name={icon} className={classes.breadcrumbIcon} />
            {title}
          </Link>
        ))}
        {/* <Link
          onClick={() =>
            Router.pushRoute("resources", { platformId, entityId, view })
          }
          variant="body2"
          className={classes.link}
        >
          <Icon name={entity.icon} className={classes.breadcrumbIcon} />
          {entity.pluralName}
        </Link> */}
        <Typography
          color="textPrimary"
          variant="body2"
          className={classes.lastLink}
        >
          <Icon name={entity.icon} className={classes.breadcrumbIcon} />
          {lastNodeTitle}
        </Typography>
      </Breadcrumbs>
    </Grid>
  );
}

export default withStyles(styles)(BreadcrumbsComponent);

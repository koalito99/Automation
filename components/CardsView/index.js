import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Badge from "@material-ui/core/Badge";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    flexDirection: "row !important",
    height: "auto !important",
    marginBottom: theme.spacing(2)
  },
  badge: {
    display: "block"
  },
  cardActionArea: {
    maxWidth: 936,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: 250,
    alignItems: "stretch",
    justifyItems: "flex-start",
    justifyContent: "flex-start"
  },
  cardMedia: {
    minWidth: "100%",
    height: 150
  },
  title: {
    fontSize: "20px",
    lineHeight: "28px"
  },
  subheader: {
    fontSize: "14px",
    lineHeight: "20px"
  }
}));

function CardsView({ onOpenHandler, items, title, countFn }) {
  const classes = useStyles();

  return (
    <>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <Grid container spacing={3} className={classes.root}>
        {items.map(item => (
          <Grid item sm={12} md={3} lg={2} key={item.type}>
            <Badge
              badgeContent={countFn ? countFn(item) : 0}
              invisible={countFn ? countFn(item) === 0 : true}
              color="primary"
              className={classes.badge}
            >
              <Card className={classes.card}>
                <CardActionArea onClick={onOpenHandler(item)} className={classes.cardActionArea}>
                  <CardMedia image={item.image} className={classes.cardMedia} />
                  <CardHeader
                    classes={{ title: classes.title, subheader: classes.subheader }}
                    title={item.title}
                    subheader={item.description}
                  />
                </CardActionArea>
              </Card>
            </Badge>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default CardsView;

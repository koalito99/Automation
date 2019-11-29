import React from "react";
import { compose, renameProps, onlyUpdateForKeys } from "recompose";
import { connectHitsPerPage, connectPagination, connectStats } from "react-instantsearch-dom";
import { withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TablePagination from "@material-ui/core/TablePagination";
import { lighten } from "@material-ui/core/styles/colorManipulator";

import MasterToolbar from "containers/MasterToolbar";
import MasterHead from "containers/MasterHead";
import MasterBody from "containers/MasterBody";
import RecordListFileUploadDropzone from "containers/RecordListFileUploadDropzone";

const styles = theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    flex: "1 0 auto",
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    overflow: "hidden",
    position: "relative"
  },
  block: {
    display: "block"
  },

  addEntity: {
    marginRight: theme.spacing(1)
  },
  contentWrapper: {
    overflowX: "auto",
    flexGrow: 1
  },
  placeholder: {
    padding: "30px"
  },
  tableHead: {
    "& th": {
      padding: "0 24px",

      "&:first-child": {
        padding: "0 12px",
        width: 40
      }
    }
  },
  tableRow: {
    cursor: "pointer",
    "& button": {
      visibility: "hidden"
    },
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      "& button": {
        visibility: "visible"
      }
    },
    "& .ais-Highlight-highlighted": {
      fontStyle: "normal",
      backgroundColor: "yellow"
    }
  },
  selectedTableRow: {
    "& td": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  emptyTableRow: {
    "& th": {
      borderBottom: "none"
    }
  },
  idCell: {
    textTransform: "uppercase",
    color: theme.palette.grey[600]
  },
  filter: {
    padding: theme.spacing(1)
  },
  badge: {
    position: "static",
    "& span": {
      position: "static",
      backgroundColor: theme.palette.grey[200],
      marginRight: theme.spacing(2)
    }
  },
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85)
  }
});

const PAGINATION_ITEMS = [
  { value: 10 },
  { value: 20 },
  { value: 50 },
  { value: 100 },
  { value: 200 }
];

class PaginationComponent extends React.Component {
  onChangePage = (e, page) => {
    this.props.refine(page + 1);
  };

  onChangeRowsPerPage = e => {
    this.props.refineHitsPerPage(e.target.value);
  };

  render() {
    const { hitsPerPage, currentHitsPerPage, currentRefinement, nbHits } = this.props;

    return (
      <TablePagination
        rowsPerPageOptions={hitsPerPage.map(item => item.value)}
        component="div"
        count={nbHits}
        rowsPerPage={currentHitsPerPage}
        page={currentRefinement - 1}
        onChangePage={this.onChangePage}
        onChangeRowsPerPage={this.onChangeRowsPerPage}
      />
    );
  }
}

const Pagination = compose(
  onlyUpdateForKeys(["entityId"]),
  connectStats,
  connectHitsPerPage,
  renameProps({
    items: "hitsPerPage",
    defaultRefinement: "defaultHitsPerPage",
    currentRefinement: "currentHitsPerPage",
    refine: "refineHitsPerPage"
  }),
  connectPagination
)(PaginationComponent);

function Master(props) {
  const {
    entityId,
    setIndexing,
    paperless,
    selectable,
    actionable,
    classes,
    onClickHandler
  } = props;

  return (
    <Paper className={classes.paper} square elevation={paperless ? 0 : 3}>
      <RecordListFileUploadDropzone>
        <div className={classes.contentWrapper}>
          <Table className={classes.table}>
            <MasterHead {...{ entityId, selectable, actionable }} />
            <MasterBody {...{ entityId, setIndexing, selectable, actionable, onClickHandler }} />
          </Table>
        </div>
        <Pagination entityId={entityId} defaultRefinement={10} items={PAGINATION_ITEMS} />
      </RecordListFileUploadDropzone>
    </Paper>
  );
}

Master.defaultProps = {
  selectable: true,
  actionable: true
};

export default withStyles(styles)(Master);

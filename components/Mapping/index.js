import React from "react";
import Typography from "@material-ui/core/Typography";
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { withStyles } from "@material-ui/core";
import styled from "styled-components";
import MuiTreeView from "blondie-material-ui-treeview";

import MappingTable from "../MappingTable";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(6)
  }
});

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TreeContainer = styled.div`
  min-width: 300px;
`;

const CreationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
`;

const Point = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Direction = styled.div``;

class Mapping extends React.Component {
  renderDirectionIcon = direction => {
    return direction === "left" ? (
      <ArrowBack fontSize="large" />
    ) : (
      <ArrowForward fontSize="large" />
    );
  };

  renderField = (field, parts) => {
    if (!parts) {
      parts = [field.parent.value];

      return this.renderField(field.parent, parts);
    }

    if (field.parent) {
      parts.unshift(field.parent.value);

      return this.renderField(field.parent, parts);
    }

    return parts.join(" ");
  };

  render() {
    const {
      sourceTypes,
      entities,
      handleSourceFieldClick,
      handleEntityFieldClick,
      handleKeyCheckboxClick,
      sourceField,
      entityField,
      mappingDirection,
      groupedMappings,
      onDelete
    } = this.props;

    return (
      <>
        {groupedMappings &&
          Object.keys(groupedMappings).map(key => (
            <MappingTable
              key={key}
              data={groupedMappings[key].rows}
              sourceType={groupedMappings[key].sourceType}
              entity={groupedMappings[key].entity}
              onDelete={onDelete}
              handleKeyCheckboxClick={handleKeyCheckboxClick}
            />
          ))}
        {!!mappingDirection && (
          <CreationContainer>
            {sourceField ? (
              <Point>
                <Typography variant="h5">{this.renderField(sourceField, [])}</Typography>
                <Typography variant="subtitle2">{sourceField.value}</Typography>
              </Point>
            ) : (
              <div />
            )}
            <Direction>{this.renderDirectionIcon(mappingDirection)}</Direction>
            {entityField ? (
              <Point>
                <Typography variant="h5">{entityField.parent.value}</Typography>
                <Typography variant="subtitle2">{entityField.value}</Typography>
              </Point>
            ) : (
              <div />
            )}
          </CreationContainer>
        )}
        <Container>
          <TreeContainer>
            <MuiTreeView tree={sourceTypes} onLeafClick={handleSourceFieldClick} />
          </TreeContainer>
          <TreeContainer>
            <MuiTreeView tree={entities} onLeafClick={handleEntityFieldClick} />
          </TreeContainer>
        </Container>
      </>
    );
  }
}

export default withStyles(styles)(Mapping);

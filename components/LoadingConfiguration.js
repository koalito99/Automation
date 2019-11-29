import React from "react";
import EmptyState from "components/EmptyState";

function LoadingConfiguration() {
  return (
    <EmptyState
      loading
      image={require("../assets/illustrations/smartphone.svg")}
      title="Building your workspace..."
      description="You have a spare second or two to clean up your desk."
    />
  );
}

export default LoadingConfiguration;

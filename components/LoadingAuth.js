import React from "react";
import EmptyState from "components/EmptyState";

function LoadingAuth() {
  return (
    <EmptyState
      loading
      image={require("../assets/illustrations/mermaid2.svg")}
      title="Identifying you..."
      description="Sit straight and don't move your head while we scan your identity."
    />
  );
}

export default LoadingAuth;

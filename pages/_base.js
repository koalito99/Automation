import React from "react";
import ConfigurationProvider from "../providers/ConfigurationProvider";
import Layout from "layouts/Layout";
import DialogProvider from '../providers/DialogProvider';

function BasePage(Container) {
  return class ResourcesPage extends React.Component {
    render() {
      return (
        <ConfigurationProvider>
          <DialogProvider>
            <Layout>
              <Container {...this.props} />
            </Layout>
          </DialogProvider>
        </ConfigurationProvider>
      );
    }
  };
}

export default BasePage;

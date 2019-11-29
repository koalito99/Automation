import React from "react";
import { asyncComponent } from "react-async-component";

function Icon(props) {
  const { name, color, size, className } = props;

  if (!name) return null;

  return React.createElement(
    asyncComponent({
      resolve: () =>
        import(
          /* webpackMode: "eager" */
          `@material-ui/icons/${_.startCase(name).replace(/\s/g, "")}TwoTone`
        )
    }),
    {
      style: { color, fontSize: size },
      className
    }
  );
}

export default Icon;

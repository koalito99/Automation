import React from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import InputAdornment from "@material-ui/core/InputAdornment";
import GooglePicker from "react-google-picker";

function GoogleDocsSelector(props) {
  const { viewId, token, setToken, onChangeHandler, ...inputProps } = props;

  return (
    <TextField
      {...inputProps}
      value={inputProps.value ? inputProps.value.name : null}
      InputProps={{
        ...inputProps.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <GooglePicker
              clientId="543356064989-tu0m528shsc878pjh69ekhqq3ulc7o39.apps.googleusercontent.com"
              developerKey={"AIzaSyBQwzOsSXrV7rdmvbQp7qWIIfdUR4Y0l5Q"}
              scope={["https://www.googleapis.com/auth/drive"]}
              onChange={onChangeHandler}
              onAuthenticate={setToken}
              onAuthFailed={data => console.log("on auth failed:", data)}
              multiselect={false}
              navHidden={true}
              authImmediate={!!token}
              viewId={viewId}
              createPicker={
                viewId !== "FOLDERS"
                  ? undefined
                  : (google, oauthToken) => {
                      const googleViewId = google.picker.ViewId.FOLDERS;
                      const docsView = new google.picker.DocsView(googleViewId)
                        .setIncludeFolders(true)
                        .setMimeTypes("application/vnd.google-apps.folder")
                        .setSelectFolderEnabled(true);

                      const picker = new window.google.picker.PickerBuilder()
                        .addView(docsView)
                        .setOAuthToken(oauthToken)
                        .setDeveloperKey("AIzaSyBQwzOsSXrV7rdmvbQp7qWIIfdUR4Y0l5Q")
                        .setCallback(onChangeHandler);

                      picker.build().setVisible(true);
                    }
              }
            >
              <IconButton>
                <InsertDriveFileIcon />
              </IconButton>
            </GooglePicker>
          </InputAdornment>
        )
      }}
    />
  );
}

export default GoogleDocsSelector;

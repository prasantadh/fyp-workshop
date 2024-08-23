import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const EditProfilePage = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Change Password</Tab>
        <Tab>Follow</Tab>
        <Tab>Followers</Tab>
      </TabList>

      <TabPanel>
        <h2>Any content 1</h2>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
    </Tabs>
  );
};

export default EditProfilePage;

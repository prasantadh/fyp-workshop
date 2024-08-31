import toast from "react-hot-toast";
import { authenticAxiosInstance } from "./axios";
import { checkForInvalidOrExpiredToken } from "./jwt_decode";

export const getUsers = () =>
  authenticAxiosInstance
    .get(`/users`)
    .then(function (response) {
      console.log(response);
      if (response.data) {
        if (response.data.status === "failure") {
          toast.error(response.data.data);
          return false;
        } else {
          toast.success("Saved data to local");
          console.log("Tweets", response.data.data);
          localStorage.setItem("users", JSON.stringify(response.data.data));
          return true;
        }
      } else {
        toast.error("Tweets: Something Went Wrong.");
      }
    })
    .catch(function (error) {
      toast.error("You need to login");
      return false;
    });

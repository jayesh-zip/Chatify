import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is small

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [{ isError, error }];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select At Least 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog
      onClose={closeHandler}
      open={isNewGroup}
      fullWidth // Ensures it takes max width available
      maxWidth="xs" // Limits size on larger screens
      sx={{
        "& .MuiDialog-paper": {
          width: isSmallScreen ? "90%" : "24rem", // Responsive width
          padding: isSmallScreen ? "1rem" : "2rem",
        },
      }}
    >
      <Stack spacing={"1rem"}>
        {/* Title */}
        <DialogTitle
          textAlign={"center"}
          variant={isSmallScreen ? "h6" : "h5"} // Smaller text on small screens
          sx={{
            fontWeight: "bold",
            borderBottom: "2px solid #ddd",
            paddingBottom: "0.75rem",
          }}
        >
          Create New Group
        </DialogTitle>

        {/* Group Name Input */}
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          fullWidth
          variant="outlined"
          inputProps={{
            maxLength: 30, // Limits input to 30 characters
          }}
          InputLabelProps={{
            shrink: true, // Ensures label moves up properly
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              minHeight: "3rem", // Ensures consistent height
            },
            "& .MuiInputBase-input": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />

        {/* Members Title */}
        <Typography
          variant={isSmallScreen ? "body1" : "h6"}
          fontWeight={"bold"}
          color="gray"
        >
          Select Members
        </Typography>

        {/* Users List */}
        <Stack
          sx={{
            maxHeight: isSmallScreen ? "20rem" : "12rem", // Adjust height for smaller screens
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "0.5rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          {isLoading ? (
            <Skeleton height={50} />
          ) : (
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            ))
          )}
        </Stack>

        {/* Action Buttons */}
        <Stack direction={"row"} spacing={1} justifyContent={"space-between"}>
          <Button
            variant="outlined"
            color="error"
            size="medium"
            sx={{
              flex: 1,
              fontWeight: "bold",
              borderRadius: "8px",
            }}
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="medium"
            sx={{
              flex: 1,
              fontWeight: "bold",
              borderRadius: "8px",
            }}
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;

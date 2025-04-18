import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import { bgGradient, matBlack } from "../constants/color";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  useEffect(() => {
    handleMobileClose(); // Close Drawer when chatId changes
  }, [chatId]); // Runs when chatId updates

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdatedValue(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    } else if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [chatId, groupDetails.data]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          spacing={"0.5rem"}
          sx={{
            maxWidth: "15rem", // Ensure the container has a fixed width
            display: "flex", // Important for truncation
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h4"
            noWrap
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%", // Ensures text does not overflow
              flexGrow: 1, // Allows it to take up remaining space
            }}
          >
            {groupName}
          </Typography>
          <IconButton
            disabled={isLoadingGroupName}
            onClick={() => setIsEdit(true)}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      spacing={"1rem"}
      p={{ xs: "0", sm: "1rem", md: "1rem 4rem" }}
      alignItems="center"
      sx={{
        pt: { xs: "1rem", sm: "0" }, // Add padding from the top in mobile screens
      }}
    >
      <Button
        size="large"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
        sx={{
          borderRadius: "1rem",
          boxShadow: "0 4px 10px rgba(255, 0, 0, 0.2)",
          transition: "all 0.3s",
          "&:hover": { boxShadow: "0 6px 15px rgba(255, 0, 0, 0.3)" },
        }}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
        sx={{
          borderRadius: "1rem",
          background: "linear-gradient(45deg, #2196F3, #21CBF3)",
          boxShadow: "0 4px 10px rgba(33, 203, 243, 0.2)",
          transition: "all 0.3s",
          "&:hover": { boxShadow: "0 6px 15px rgba(33, 203, 243, 0.3)" },
        }}
      >
        Add Member
      </Button>
    </Stack>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid
      container
      height="100vh"
      sx={{
        backgroundColor: "#f4f6f8",
        overflow: "hidden",
      }}
    >
      {/* Sidebar (Hidden on Mobile) */}
      <Grid
        item
        sm={4}
        sx={{
          display: { xs: "none", sm: "block" },
          backgroundColor: "#fff",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      {/* Main Content */}
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "2rem",
          backgroundColor: "#fff",
          borderRadius: "1rem",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            <Box
              sx={{
                maxWidth: "20rem", // Adjust as needed
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {GroupName}
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="gray"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                paddingBottom: "0.5rem",
              }}
            >
              <GroupsIcon sx={{ fontSize: 24, color: "#555" }} />
              Members
            </Typography>

            {/* Members List */}
            <Stack
              maxWidth="45rem"
              width="100%"
              boxSizing="border-box"
              padding={{ xs: "0", sm: "1rem", md: "1rem 4rem" }}
              spacing="1rem"
              height="50vh"
              overflow="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#ccc",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#6CC1E3",
                },
              }}
            >
              {isLoadingRemoveMember ? (
                <CircularProgress />
              ) : (
                members.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between", // Ensures icon is at right
                      width: "100%",
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "#fff",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
                        transform: "scale(1.02)",
                      },
                    }}
                    nameStyling={{
                      flexGrow: 1, // Ensures name takes available space
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginLeft: "0.5rem", // Adjust spacing after avatar
                      maxWidth: "12rem", // Truncate long names
                    }}
                    iconStyling={{
                      flexShrink: 0, // Prevents shrinking
                      marginLeft: "auto", // Pushes remove icon to the right
                    }}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </Stack>

            {ButtonGroup}
          </>
        )}
      </Grid>

      {/* Mobile Drawer for Group List */}
      <Drawer
        sx={{ display: { xs: "block", sm: "none" } }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList
          w="85vw"
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
          onClose={handleMobileClose}
        />
      </Drawer>

      {/* Dialogs */}
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId, handleClose }) => (
  <Stack
    width={w}
    sx={{
      // backgroundImage: bgGradient,
      backgroundColor: "#dee2e6",
      height: "100vh",
      overflow: "auto",
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem
          group={group}
          chatId={chatId}
          key={group._id}
          handleClose={handleClose}
        />
      ))
    ) : (
      <Typography textAlign={"center"} padding="1rem">
        No groups
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId, handleClose }) => {
  const { name, avatar, _id } = group;
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault(); // Prevent default navigation
    if (chatId !== _id) {
      navigate(`?group=${_id}`);
    }
    if (handleClose) handleClose(); // Ensure Drawer closes
  };

  return (
    <Link
      to={`?group=${_id}`}
      onClick={handleClick} // Use handleClick here
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography
          variant="body1"
          noWrap
          sx={{
            maxWidth: "20rem", // Adjust max width as needed
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </Typography>
      </Stack>
    </Link>
  );
});

export default Groups;

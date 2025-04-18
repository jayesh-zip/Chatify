import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  return (
    <Dialog
      open={isNotification}
      onClose={closeHandler}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 0.3s ease-in-out",
          width: "28rem",
        },
      }}
    >
      <Stack p={3} direction="column">
        <DialogTitle textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            Notifications
          </Typography>
        </DialogTitle>

        {isLoading ? (
          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: "8px" }} />
        ) : data?.allRequests.length > 0 ? (
          data?.allRequests?.map(({ sender, _id }) => (
            <React.Fragment key={_id}>
              <NotificationItem sender={sender} _id={_id} handler={friendRequestHandler} />
              <Divider sx={{ my: 1 }} />
            </React.Fragment>
          ))
        ) : (
          <Typography textAlign="center" color="textSecondary" variant="body2" mt={2}>
            No new notifications
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem
      sx={{
        background: "#f9f9f9",
        borderRadius: "8px",
        p: 2,
        "&:hover": { background: "#f1f1f1" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} width="100%">
        <Avatar src={avatar} sx={{ width: 45, height: 45 }} />

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: "6px", textTransform: "none" }}
            onClick={() => handler({ _id, accept: true })}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ borderRadius: "6px", textTransform: "none" }}
            onClick={() => handler({ _id, accept: false })}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;

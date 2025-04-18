import { Drawer, Grid, Skeleton, Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const handleChatSelect = () => {
      dispatch(setIsMobile(false)); // Close drawer on chat selection
    };

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {/* Mobile Chat Drawer */}
        {isLoading ? (
          <Skeleton variant="rectangular" height="100vh" />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            {/* <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
              <button
                onClick={handleMobileClose}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </Box> */}

            <ChatList
              w="85vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
              onChatSelect={handleChatSelect}
            />
          </Drawer>
        )}

        {/* Main Layout Grid */}
        <Grid
          container
          height={"calc(100vh - 4rem)"}
          sx={{ overflow: "hidden" }}
        >
          {/* Chat List Section (Scrollable) */}
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
              borderRight: "1px solid #ddd",
              background: "#f8f9fa",
              height: "100%",
              overflowY: "auto", // ✅ Enables scrolling
              maxHeight: "calc(100vh - 4rem)", // ✅ Ensures it does not exceed screen height
              minHeight: 0, // ✅ Allows scrolling inside flex/grid containers
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" height="100%" />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto", // ✅ Enables scrolling
                  flexGrow: 1, // ✅ Ensures expansion inside Grid
                  minHeight: 0, // ✅ Required for flex scrolling
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              </Box>
            )}
          </Grid>

          {/* Chat Section (Now Takes Full Remaining Space) */}
          <Grid
            item
            xs={12}
            sm={8}
            md={9} // Previously md={5}, now taking the space of removed Profile Section
            lg={9} // Previously lg={6}, now expanded
            height={"100%"}
            sx={{
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                background: "#f0f2f5",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                },
                "&:hover::-webkit-scrollbar": {
                  display: "block",
                },
              }}
            >
              <WrappedComponent {...props} chatId={chatId} user={user} />
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;

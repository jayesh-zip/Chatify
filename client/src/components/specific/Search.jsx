import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 300);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 0.3s ease-in-out",
        },
      }}
    >
      <Stack
        p={3}
        direction="column"
        width={{ xs: "20rem", sm: "24rem", md: "28rem" }}
      >
        <DialogTitle textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            Find People
          </Typography>
        </DialogTitle>

        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <TextField
            fullWidth
            placeholder="Search for friends..."
            value={search.value}
            onChange={search.changeHandler}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                "&:hover": { backgroundColor: "#ebebeb" },
              },
              "& .MuiInputAdornment-root": { ml: 1 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#777" }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <List
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#ccc",
              borderRadius: "6px",
            },
          }}
        >
          {users.length > 0 ? (
            users.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))
          ) : (
            <Typography
              textAlign="center"
              color="textSecondary"
              variant="body2"
              mt={2}
            >
              No users found
            </Typography>
          )}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;

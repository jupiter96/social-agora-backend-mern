import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Backend Api
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_BASE_URL ||
      "https://api.agorasocialgaming.com",
  }), // base url
  reducerPath: "adminApi",
  // tags
  tagTypes: [
    "Feeds",
    "Users",
    "Games",
    "Groups",
    "Payments",
    "Messages",
    "Notifications",
    "Tournaments",
  ],
  // endpoints
  endpoints: (build) => ({
    getLogin: build.mutation({
      query: (user) => ({
        url: 'users/login',
        method: 'POST',
        body: user,
      }),
      providesTags: ['Users'],
    }),


    //***************    Dashboard   **********************
    getUserStatistics: build.query({
      query: () => "users/getstatistics",
      providesTags: ["Users"],
    }),
    getPostStatistics: build.query({
      query: () => "posts/getfeedstatistics",
      providesTags: ["Feeds"],
    }),
    getGameStatistics: build.query({
      query: () => "games/getgamestatistics",
      providesTags: ["Games"],
    }),
    getGroupStatistics: build.query({
      query: () => "groups/getgroupstatistics",
      providesTags: ["Groups"],
    }),
    getNotificationStatistics: build.query({
      query: () => "notifications/getnotificationstatistics",
      providesTags: ["Notifications"],
    }),
    getPaymentStatistics: build.query({
      query: () => "payments/getpaymentstatistics",
      providesTags: ["Payments"],
    }),
    getTournamentStatistics: build.query({
      query: () => "tournaments/gettournamentstatistics",
      providesTags: ["Tournaments"],
    }),


    //***************    Users   **********************
    getAllusers: build.query({
      query: () => ({
        url: "users/getallusers",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Users"],
    }),
    createUser: build.mutation({
      query: (user) => ({
        url: 'users/signup',
        method: 'POST',
        body: user,
      }),
      providesTags: ['Users'],
    }),
    editUser: build.mutation({
      query: (user) => ({
        url: `users/edituser/${user.id}`,
        method: 'PUT',
        body: user,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Users'],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `users/deleteuser/${id}`,
        method: 'DELETE',
      }),
      providesTags: ['Users'],
    }),

    //***************    Feeds   **********************
    getAllFeeds: build.query({
      query: () => ({
        url: "posts/feed",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Feeds"],
    }),
    createFeed: build.mutation({
      query: (feed) => ({
        url: 'posts/create',
        method: 'POST',
        body: feed,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Feeds'],
    }),
    editFeed: build.mutation({
      query: (feed) => ({
        url: `posts/editfeed/${feed.id}`,
        method: 'PUT',
        body: feed,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Feeds'],
    }),
    deleteFeed: build.mutation({
      query: (id) => ({
        url: `posts/deletefeed/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Feeds'],
    }),

    //***************    Games   **********************
    getAllGames: build.query({
      query: () => ({
        url: "games/getgames",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Games"],
    }),
    createGame: build.mutation({
      query: (game) => ({
        url: 'games/create',
        method: 'POST',
        body: game,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Games'],
    }),
    editGame: build.mutation({
      query: (game) => ({
        url: `games/editgame/${game.id}`,
        method: 'PUT',
        body: game,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Games'],
    }),
    deleteGame: build.mutation({
      query: (id) => ({
        url: `games/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Games'],
    }),

    //***************    Groups   **********************
    getAllGroups: build.query({
      query: () => ({
        url: "groups/getgroups",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Groups"],
    }),
    createGroup: build.mutation({
      query: (group) => ({
        url: 'groups/create',
        method: 'POST',
        body: group,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Groups'],
    }),
    editGroup: build.mutation({
      query: (group) => ({
        url: `groups/editgroup/${group.id}`,
        method: 'PUT',
        body: group,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Groups'],
    }),
    deleteGroup: build.mutation({
      query: (id) => ({
        url: `groups/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Groups'],
    }),

    //***************    Notifications   **********************
    getAllNotifications: build.query({
      query: () => ({
        url: "notifications/getnotifications",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Notifications"],
    }),
    createNotification: build.mutation({
      query: (notification) => ({
        url: 'notifications/create',
        method: 'POST',
        body: notification,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Notifications'],
    }),
    editNotification: build.mutation({
      query: (notification) => ({
        url: `notifications/editnotification/${notification.id}`,
        method: 'PUT',
        body: notification,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Notifications'],
    }),
    deleteNotification: build.mutation({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Notifications'],
    }),

    //***************    Payments   **********************
    getAllPayments: build.query({
      query: () => ({
        url: "payments/getpayments",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Payments"],
    }),

    //***************    tournaments   **********************
    getAllTournaments: build.query({
      query: () => ({
        url: "tournaments/gettournaments",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Tournaments"],
    }),
    createTournament: build.mutation({
      query: (tournament) => ({
        url: 'tournaments/create',
        method: 'POST',
        body: tournament,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Tournaments'],
    }),
    editTournament: build.mutation({
      query: (tournament) => ({
        url: `tournaments/edittournament/${tournament.id}`,
        method: 'PUT',
        body: tournament,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Tournaments'],
    }),
    deleteTournament: build.mutation({
      query: (id) => ({
        url: `tournaments/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Tournaments'],
    }),
  }),
});

// export api endpoints
export const {
  useGetLoginMutation,

  useGetUserStatisticsQuery,
  useGetPostStatisticsQuery,
  useGetGameStatisticsQuery,
  useGetGroupStatisticsQuery,
  useGetNotificationStatisticsQuery,
  useGetPaymentStatisticsQuery,
  useGetTournamentStatisticsQuery,

  useGetAllusersQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,

  useGetAllFeedsQuery,
  useCreateFeedMutation,
  useEditFeedMutation,
  useDeleteFeedMutation,
  
  useGetAllGamesQuery,
  useCreateGameMutation,
  useEditGameMutation,
  useDeleteGameMutation,
  
  useGetAllGroupsQuery,
  useCreateGroupMutation,
  useEditGroupMutation,
  useDeleteGroupMutation,
  
  useGetAllNotificationsQuery,
  useCreateNotificationMutation,
  useEditNotificationMutation,
  useDeleteNotificationMutation,
  
  useGetAllPaymentsQuery,
  
  useGetAllTournamentsQuery,
  useCreateTournamentMutation,
  useEditTournamentMutation,
  useDeleteTournamentMutation,

} = api;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Backend Api
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_BASE_URL ||
      "http://localhost:8080",
  }), // base url
  reducerPath: "adminApi",
  // tags
  tagTypes: [
    "User",
    "Post",
    "Users",
    "Transactions",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
  ],
  // endpoints
  endpoints: (build) => ({
    getLogin: build.mutation({
      query: (user) => ({
        url: 'users/login',
        method: 'POST',
        body: user,
      }),
      providesTags: ['User'],
    }),
    getUserStatistics: build.query({
      query: () => "users/getstatistics",
      providesTags: ["User"],
    }),
    getPostStatistics: build.query({
      query: () => "posts/getfeedstatistics",
      providesTags: ["Post"],
    }),
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
      providesTags: ['User'],
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
      providesTags: ['User'],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `users/deleteuser/${id}`,
        method: 'DELETE',
      }),
      providesTags: ['User'],
    }),
    getAllFeeds: build.query({
      query: () => ({
        url: "posts/feed",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      providesTags: ["Post"],
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
      providesTags: ['Post'],
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
      providesTags: ['Post'],
    }),
    deleteFeed: build.mutation({
      query: (id) => ({
        url: `posts/deletefeed/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Post'],
    }),
  }),
});

// export api endpoints
export const {
  useGetLoginMutation,
  useGetUserStatisticsQuery,
  useGetPostStatisticsQuery,
  useGetAllusersQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useGetAllFeedsQuery,
  useCreateFeedMutation,
  useEditFeedMutation,
  useDeleteFeedMutation,

} = api;

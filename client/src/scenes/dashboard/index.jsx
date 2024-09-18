import React from "react";
import {
  DownloadOutlined,
  SportsEsports,
  Diversity1,
  Group,
  Wifi,
  Paid,
  LocalFireDepartment,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from 'react-i18next';
import { 
  useGetUserStatisticsQuery, 
  useGetPostStatisticsQuery,
  useGetGameStatisticsQuery,
  useGetGroupStatisticsQuery,
  useGetPaymentStatisticsQuery,
  useGetTournamentStatisticsQuery,
 } from "state/api";
import { useSelector } from "react-redux";

// import { useGetDashboardQuery } from "state/api";
import {
  FlexBetween,
  Header,
  // BreakdownChart,
  OverviewChart,
  StatBox,
} from "components";

const Dashboard = () => {
  // theme
  const theme = useTheme();
  const { data: getUserStatistics } = useGetUserStatisticsQuery();
  const { data: getPostStatistics } = useGetPostStatisticsQuery();
  const { data: getGameStatistics } = useGetGameStatisticsQuery();
  const { data: getGroupStatistics } = useGetGroupStatisticsQuery();
  const { data: getPaymentStatistics } = useGetPaymentStatisticsQuery();
  const { data: getTournamentStatistics } = useGetTournamentStatisticsQuery();
  const data = {
    ...getUserStatistics,
    ...getPostStatistics,
    ...getGameStatistics,
    ...getGroupStatistics,
    ...getPaymentStatistics,
    ...getTournamentStatistics
  };
  const { t } = useTranslation();
  // is large desktop screen
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const currentUser = useSelector((state) => state.global.userInfo);
  // data columns
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        {/* Header */}
        <Header title={t("dashboard")} subtitle={`${t('welcome') }, ${currentUser.name}`} />

        {/* Content */}
        <Box>
          {/* Download Reports */}
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: 50,
              "&:hover": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary.light,
              },
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            {t("download")}
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 12",
          },
        }}
      >
        {/* ROW 1 */}
        {/* Total Customers */}
        <StatBox
          title={t("totalUsers")}
          value={data ? data.totalUser : 0}
          increase={14}
          description={t("lastMonth")}
          icon={
            <Group
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Sales Today */}
        <StatBox
          title={t("totalGames")}
          value={data?.gameCount ? data.gameCount: 0}
          increase={21}
          description={t("lastMonth")}
          icon={
            <SportsEsports
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* Monthly Sales */}
        <StatBox
          title={t("totalGroups")}
          value={data?.groupCount ? data.groupCount: 0}
          increase={-5}
          description={t("lastMonth")}
          icon={
            <Diversity1
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* Yearly Sales */}
        <StatBox
          title={t("totalFeeds")}
          value={data && data.postCount}
          increase={43}
          description={t("lastMonth")}
          icon={
            <Wifi
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* Monthly Sales */}
        <StatBox
          title={t("totalPayments")}
          value={data.paymentCount ? `$${data.paymentCount}`: "$0"}
          increase={32}
          description={t("lastMonth")}
          icon={
            <Paid
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* Overview Chart */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>


        {/* Yearly Sales */}
        <StatBox
          title={t("totalTournaments")}
          value={data.tournamentCount ? data.tournamentCount:0}
          increase={-13}
          description={t("lastMonth")}
          icon={
            <LocalFireDepartment
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />



        {/* ROW 2 */}
        {/* Transactions */}
        {/* <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButtom-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.transactions) || []}
            columns={columns}
          />
        </Box> */}

        {/* Sales by Category */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales by Category
          </Typography>

          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{
              color: theme.palette.secondary[200],
            }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;

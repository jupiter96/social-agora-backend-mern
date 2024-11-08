import React, {useRef} from "react";
import {
  DownloadOutlined,
  SportsEsports,
  Diversity1,
  Group,
  Wifi,
  Paid,
  LocalFireDepartment,
} from "@mui/icons-material";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
  FlexMobile,
  Header,
  // BreakdownChart,
  OverviewChart,
  StatBox,
} from "components";
import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

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
  const chartRef = useRef();
  // is large desktop screen
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  const currentUser = useSelector((state) => state.global.userInfo);

  const downloadPDF = async(data) => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();
    doc.text("Informes", 14, 8);
    
    doc.addImage(imgData, 'PNG', 14, 30, 180, 100); 
    // Create a table from the data
    doc.autoTable({
      head: [[t("totalUsers"), t("totalGames"), t("totalGroups"), t("totalFeeds"), t("totalPayments"), t("totalTournaments")]],
      body: [
        [data.totalUser, data.gameCount, data.groupCount, data.postCount, data.totalAmount, data.tournamentCount],
      ],
    });
  
    doc.save(`${Date.now()}_Informes.pdf`);
  };

  const downloadExcel = async(data) => {
    
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Informes');

    // Add data to Excel
    worksheet.addRow([t("totalUsers"), t("totalGames"), t("totalGroups"), t("totalFeeds"), t("totalPayments"), t("totalTournaments")]);
    worksheet.addRow([data.totalUser, data.gameCount, data.groupCount, data.postCount, data.totalAmount, data.tournamentCount]);

    // Add chart image to Excel
    const imageId = workbook.addImage({
      base64: imgData,
      extension: 'png',
    });

    // Add the image to the worksheet
    worksheet.addImage(imageId, {
      tl: { col: 0, row: 3 }, // Adjust the position as needed
      ext: { width: 500, height: 300 }, // Adjust size as needed
    });

    // Write the workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create a Blob from the buffer and save it
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${Date.now()}_Informes.xlsx`);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexMobile>
        {/* Header */}
        <Header title={t("dashboard")} subtitle={`${t('welcome') }, ${currentUser.name}`} />

        {/* Content */}
        <Box>
          {/* Download Reports */}
          <Button
            onClick={()=>downloadExcel(data)}
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
            {t("Excel")}
          </Button>
          <Button
            onClick={()=>downloadPDF(data)}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              marginLeft: 2,
              borderRadius: 50,
              "&:hover": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary.light,
              },
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            {t("PDF")}
          </Button>
        </Box>
      </FlexMobile>

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
          increase={data ? data.monthlyUserCount : 0}
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
          increase={data?.monthlyGameCount ? data.monthlyGameCount : 0}
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
          increase={data?.monthlyGroupCount ? data.monthlyGroupCount : 0}
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
          value={data ? data.postCount : 0}
          increase={data ? data.monthlyPostCount : 0}
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
          value={data.totalAmount ? `$${data.totalAmount}`: "$0"}
          increase={data.monthlyTotal ? `$${data.monthlyTotal}`: "$0"}
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
          ref={chartRef}
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>


        {/* Yearly Sales */}
        <StatBox
          title={t("totalTournaments")}
          value={data.tournamentCount ? data.tournamentCount:0}
          increase={data.monthlyTournamentCount ? data.monthlyTournamentCount:0}
          description={t("lastMonth")}
          icon={
            <LocalFireDepartment
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
      </Box>
    </Box>
  );
};

export default Dashboard;

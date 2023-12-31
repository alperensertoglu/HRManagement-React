import axios from "axios";
import React, { Component, useState } from "react";
import jwtDecode from "jwt-decode";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      showText: false,
      activeComments: [], // Yorumları saklamak için bir state ekledik
      userInfo: null, // Kullanıcı bilgilerini saklamak için bir state ekledik
    };
  }

  componentDidMount() {
    // Sayfa yüklendiğinde yorumları getir
    this.fetchActiveComments();

    // Sayfa yüklendiğinde kullanıcı bilgilerini getir
    this.fetchUserInfo();
  }

  fetchActiveComments = () => {
    fetch("http://34.173.81.212/comment/active-comments")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ activeComments: data });
      })
      .catch((error) => {
        console.error("Hata:", error);
      });
  };

  fetchUserInfo = () => {
    const storedToken = localStorage.getItem("Authorization");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      const userId = decodedToken.myId;
      axios
        .get(`http://34.173.81.212/user/find_by_id/${userId}`)
        .then((response) => {
          this.setState({ userInfo: response.data });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  handleInputChange = (event) => {
    this.setState({ inputText: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const storedToken = localStorage.getItem("Authorization");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      const userId = decodedToken.myId;
      const apiUrl = "http://34.173.81.212/comment/personel-make-comment";

      this.setState({ showText: true });

      try {
        const companyId = this.state.userInfo.companyId;
        await axios.get(
          `${apiUrl}/${userId}?comment=${this.state.inputText}&companyId=${companyId}`
        );
        this.setState({ inputText: "", showText: false });
        this.fetchActiveComments(); // Yorumları güncelleyin
      } catch (error) {
        console.error(error);
      }
    }
  };

  render() {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDTypography variant="h4" fontWeight="medium" color="secondary" mt={1}>
          Comments
        </MDTypography>
        <MDBox pt={4} pb={3} px={3} textAlign="center">
          <form onSubmit={this.handleSubmit}>
            <MDInput
              type="text"
              name="comment"
              placeholder="Your Comment"
              fullWidth
              color="info"
              value={this.state.inputText}
              onChange={this.handleInputChange}
            />
            <MDBox mt={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="success"
                fullWidth
                onClick={this.handleSubmit}
              >
                Submit
              </MDButton>
            </MDBox>
            <h2>Comments</h2>
            {this.state.activeComments.length > 0 && (
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead
                    sx={{
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <TableRow sx={{ display: "flex", gap: 5 }}>
                      <TableCell sx={{ textAlign: "center" }}>Name </TableCell>
                      <TableCell>Email </TableCell>
                      <TableCell sx={{ marginLeft: 18 }}>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                {this.state.activeComments.map((comment, index) => (
                  <TableContainer component={Paper} key={index}>
                    <Table sx={{ minWidth: 650 }} size="medium" aria-label="a dense table">
                      <TableBody
                        sx={{ justifyContent: "center", textAlign: "center", alignItems: "center" }}
                      >
                        <TableRow sx={{ display: "flex", gap: 5 }}>
                          <TableCell sx={{ fontFamily: "monospace", textAlign: "left" }}>
                            {this.state.userInfo.name}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "monospace", textAlign: "left" }}>
                            {this.state.userInfo.email}
                          </TableCell>
                          <TableCell sx={{ fontFamily: "monospace", textAlign: "left" }}>
                            {comment.comment}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ))}
              </TableContainer>
            )}
          </form>
        </MDBox>
      </DashboardLayout>
    );
  }
}

export default Comment;

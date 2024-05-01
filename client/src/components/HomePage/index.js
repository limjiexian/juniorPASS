import React from "react";
import {
  Button,
  Card,
  Space,
  Typography,
  Image,
  Col,
  Row,
  FloatButton,
} from "antd";
import { UpOutlined } from "@ant-design/icons";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Grid } from "@splidejs/splide-extension-grid";
import "@splidejs/react-splide/dist/css/splide.min.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const { Title, Text } = Typography;

const HomePage = () => {
  const images = require.context("../../images/partners", true);
  const imageList = images.keys().map((image) => images(image));
  const { isDesktop, isMobile } = useWindowDimensions();
  const desktopStyles = {
    divPadding: {
      padding: "24px",
    },
    div: {
      padding: "0 180px",
    },
    splideCard: {
      width: 240,
      height: 240,
    },
    cardWidth: {
      width: "550px",
      margin: "0 auto",
      right: "340px",
      top: "250px",
    },
    titleForCard: {
      fontWeight: 1000,
      fontSize: 48,
    },
  };

  const mobileStyles = {
    divPadding: {
      padding: "16px",
    },
    div: {
      padding: 0,
    },
    splideCard: {
      width: 150,
      height: 150,
    },
    cardWidth: isMobile
      ? { width: "200px", margin: "0 auto", right: "36px", top: "140px" }
      : {
          width: "350px",
          margin: "0 auto",
          right: "60px",
          top: "150px",
        },
    titleForCard: isMobile
      ? { fontWeight: 800, fontSize: 16 }
      : {
          fontWeight: 800,
          fontSize: 24,
        },
  };
  const definedStyle = isDesktop ? desktopStyles : mobileStyles;

  return (
    <div style={definedStyle.div}>
      {/* thumbnail */}
      <div>
        <Image
          src={require("../../images/cover.jpg")}
          alt="cover"
          style={{
            width: "100%",
            backgroundSize: "contain",
            // height: isDesktop ? "" : isMobile ? "36vh" : "",
            filter: "brightness(50%)",
            margin: 0,
            padding: 0,
          }}
          preview={false}
        />
        {/* <Card
          style={{
            backgroundColor: "#FFDEDE",
            borderRadius: "30px",
            position: "absolute",
            ...definedStyle.cardWidth,
          }}
        >
          <Space direction="vertical" size={isDesktop ? "large" : "small"}>
            <Title style={{ color: "#98BDD2", ...definedStyle.titleForCard }}>
              Preparing preschoolers for life
            </Title>
            <Text>
              Unleashing potential through diverse classes for young minds
            </Text>
            <Link to="/classes">
              <Button
                style={{
                  borderRadius: "30px",
                }}
              >
                Find out more
              </Button>
            </Link>
          </Space>
        </Card> */}
      </div>

      <div style={{ height: 48 }}></div>

      {/* Explore by age */}
      <div style={definedStyle.divPadding}>
        <Title level={isDesktop ? 1 : 3} style={{ textAlign: "center" }}>
          Explore by age
        </Title>
        <Space direction="horizontal">
          <Card></Card>
        </Space>
      </div>

      {/* Explore by categories */}
      <div style={definedStyle.divPadding}>
        <Title level={isDesktop ? 1 : 3} style={{ textAlign: "center" }}>
          Explore by categories
        </Title>
      </div>

      {/* partners */}
      <div style={definedStyle.divPadding}>
        <Title level={isDesktop ? 1 : 3} style={{ textAlign: "center" }}>
          As seen on
        </Title>
        <Splide
          style={{
            width: "100%",
          }}
          extensions={{ Grid }}
          options={{
            pagination: false,
            drag: "free",
            perPage: isDesktop ? 4 : isMobile ? 3 : 4,
            perMove: 1,
            autoplay: "true",
            type: "loop",
            rewind: true,
            lazyLoad: "nearby",
            cover: true,
            grid: {
              rows: 1,
            },
            autoScroll: {
              speed: 1,
            },
          }}
        >
          {imageList.map((image, index) => (
            <SplideSlide>
              <Card
                style={{
                  display: "flex",
                  ...definedStyle.splideCard,
                }}
                bodyStyle={{
                  alignItems: "center",
                  display: "flex",
                }}
                bordered={false}
              >
                <Image
                  key={index}
                  src={image}
                  alt={`image-${index}`}
                  preview={false}
                />
              </Card>
            </SplideSlide>
          ))}
        </Splide>
      </div>

      {/* CTA button */}
      <div>
        <Title level={isDesktop ? 1 : 3}>Discover and book with ease</Title>
        <Text>
          At JuniorPass, we make it simple for parents to find and secure the
          perfect enrichment class for their child. Browse through our extensive
          selection of classes and book with just a few clicks.
        </Text>
        <Button type={"primary"}>Browse</Button>
      </div>

      <FloatButton.BackTop icon={<UpOutlined />} />
    </div>
  );
};

export default HomePage;

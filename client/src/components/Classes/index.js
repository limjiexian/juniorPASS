import React, { useEffect, useState, useMemo } from "react";
import { Avatar, Input, List, Flex, Rate, Image } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Classes = () => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [filterInput, setFilterInput] = useState(null);
  const getVendors = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/vendors/getAllVendors"
      );
      const jsonData = await response.json();
      setVendors(jsonData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const pins = useMemo(
    () =>
      vendors.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="top"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(city);
          }}
        ></Marker>
      )),
    [vendors]
  );

  const onSearch = (e) => {
    const filteredData = vendors.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    });
    setFilterInput(filteredData);
  };

  useEffect(() => {
    getVendors();
  }, []);

  return (
    <>
      <Input
        size="large"
        allowClear
        onChange={onSearch}
        style={{ width: "100vh" }}
        prefix={<SearchOutlined />}
      />
      <Flex justify="space-between">
        <List
          itemLayout="horizontal"
          dataSource={filterInput == null ? vendors : filterInput}
          style={{
            width: "40%",
          }}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Image
                    src={item.picture}
                    width={240}
                    preview={false}
                    onMouseOver={(e) => {
                      // make the color of the pin changed to white
                      setPopupInfo(item);
                    }}
                  />
                }
                title={<a href={item.website}>{item.vendor_name}</a>}
                description={item.description}
              ></List.Item.Meta>
              <Rate disabled defaultValue={item.reviews}></Rate>
            </List.Item>
          )}
        ></List>

        <Map
          initialViewState={{
            longitude: 103.8189,
            latitude: 1.3069,
            zoom: 10,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v8"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          style={{ width: "50%", height: 400 }}
          mapLib={import("mapbox-gl")}
        >
          <GeolocateControl position="top-left" />
          <NavigationControl position="top-left" />
          {pins}

          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.longitude)}
              latitude={Number(popupInfo.latitude)}
              onClose={() => setPopupInfo(null)}
            >
              <div>
                <a target="_new" href={popupInfo.website}>
                  {popupInfo.vendor_name}
                </a>
              </div>
              <img width="100%" src={popupInfo.picture} />
            </Popup>
          )}
        </Map>
      </Flex>
    </>
  );
};

export default Classes;

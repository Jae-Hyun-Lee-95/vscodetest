import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const mapRef = useRef(null);
  const [currentTypeId, setCurrentTypeId] = useState(null);

  useEffect(() => {
    // 카카오 지도 API 로드 여부 확인
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
      const mapCenter = new window.kakao.maps.LatLng(37.566826, 126.9786567);
      const options = { // 지도를 생성할 때 필요한 기본 옵션
        center: mapCenter, // 지도의 중심좌표.
        level: 7 // 지도의 레벨(확대, 축소 정도)
      };

      mapRef.current = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      const mapTypeControl = new window.kakao.maps.MapTypeControl()
      // 지도 타입 컨트롤을 지도에 표시합니다
      mapRef.current.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
      const zoomControl = new window.kakao.maps.ZoomControl();
      mapRef.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 지도에 지형정보를 표시하도록 지도타입을 추가합니다
      mapRef.current.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TERRAIN)

      // 로드뷰를 표시할 div와 로드뷰 객체 생성
      const roadviewContainer = document.getElementById('roadview'); // 로드뷰를 표시할 div
      const roadview = new window.kakao.maps.Roadview(roadviewContainer); // 로드뷰 객체
      const roadviewClient = new window.kakao.maps.RoadviewClient(); // 좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper 객체

      const position = mapCenter;

      // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
      roadviewClient.getNearestPanoId(position, 50, function(panoId) {
        roadview.setPanoId(panoId, position); // panoId와 중심좌표를 통해 로드뷰 실행
      });


      function getInfo() {
        // 지도의 현재 중심좌표를 얻어옵니다 
        const center = mapRef.current.getCenter();

        // 지도의 현재 레벨을 얻어옵니다
        const level = mapRef.current.getLevel();

        // 지도타입을 얻어옵니다
        const mapTypeId = mapRef.current.getMapTypeId();

        // 지도의 현재 영역을 얻어옵니다 
        const bounds = mapRef.current.getBounds();

        // 영역의 남서쪽 좌표를 얻어옵니다 
        const swLatLng = bounds.getSouthWest();

        // 영역의 북동쪽 좌표를 얻어옵니다 
        const neLatLng = bounds.getNorthEast();

        // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
        const boundsStr = bounds.toString();

        let message = '지도 중심좌표는 위도 ' + center.getLat() + ', <br>';
        message += '경도 ' + center.getLng() + ' 이고 <br>';
        message += '지도 레벨은 ' + level + ' 입니다 <br> <br>';
        message += '지도 타입은 ' + mapTypeId + ' 이고 <br> ';
        message += '지도의 남서쪽 좌표는 ' + swLatLng.getLat() + ', ' + swLatLng.getLng() + ' 이고 <br>';
        message += '북동쪽 좌표는 ' + neLatLng.getLat() + ', ' + neLatLng.getLng() + ' 입니다';

        // 개발자도구를 통해 직접 message 내용을 확인해 보세요.
        console.log(message);
      }

      // 예시로, 컴포넌트가 로드된 후 getInfo 함수를 호출합니다.
      getInfo();
    }
  }, []);

  // 버튼이 클릭되면 호출되는 함수입니다
  function setOverlayMapTypeId(maptype){
    if(mapRef.current){
      let changeMaptype;
      if (maptype === 'roadview'){
        // 지도에 로드뷰 정보가 있는 도로를 표시하도록 지도타입을 추가합니다
        changeMaptype = window.kakao.maps.MapTypeId.ROADVIEW;
      }

      
      if (currentTypeId === changeMaptype) {
        // maptype에 해당하는 지도타입을 제거합니다.
        mapRef.current.removeOverlayMapTypeId(changeMaptype);
        setCurrentTypeId(null);
      }else{
        // maptype에 해당하는 지도타입을 지도에 추가합니다
        mapRef.current.addOverlayMapTypeId(changeMaptype);
        setCurrentTypeId(changeMaptype);
      }
    }
  }

  return (
    <div>
      <div id="map" style={{ width: '700px', height: '700px' }}></div>
      <div id="maplevel"></div>
      <button onClick={() => setOverlayMapTypeId('roadview')}>로드뷰 도로정보 보기</button>
      <div id="roadview" style={{ width: '700px', height: '700px', marginTop: '20px' }}></div>
    </div>
  );
}

export default App;

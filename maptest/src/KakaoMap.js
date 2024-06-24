import './KakaoMap.css';

function KakaoMap(){
    const mapRef = useRef(null);
    const [currentTypeId, setCurrentTypeId] = useState(null);

    useEffect(() => {
        // 카카오 지도 API 로드 여부 확인
        if (window.kakao && window.kakao.maps) {
            const overlayOn = false // 지도 위에 로드뷰 오버레이가 추가된 상태를 가지고 있을 변수
            const container = document.getElementById('container') // 지도와 로드뷰를 감싸고 있는 div 입니다
            const mapWrapper = document.getElementById('mapWrapper') // 지도를 감싸고 있는 div 입니다
            const mapContainer = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
            const rvContainer = document.getElementById('roadview'); //로드뷰를 표시할 div 입니다

            const mapCenter = new window.kakao.maps.LatLng(37.566826, 126.9786567);
            const mapOptions = { // 지도를 생성할 때 필요한 기본 옵션
                center: mapCenter, // 지도의 중심좌표.
                level: 7 // 지도의 레벨(확대, 축소 정도)
            };
    
            // 지도를 표시할 div와 지도 옵션으로 지도를 생성합니다
            mapRef.current = new window.kakao.maps.Map(mapContainer, mapOptions); // 지도 생성 및 객체 리턴
        
            // 로드뷰 객체를 생성합니다
            mapRef.rv = new window.kakao.maps.Roadview(rvContainer);

            // 좌표로부터 로드뷰 파노라마 ID를 가져올 로드뷰 클라이언트 객체를 생성합니다 
            mapRef.rvClient = new window.kakao.maps.RoadviewClient();

            // 로드뷰에 좌표가 바뀌었을 때 발생하는 이벤트를 등록합니다 
            window.kakao.maps.event.addListener(rv, 'position_changed', function() {

                // 현재 로드뷰의 위치 좌표를 얻어옵니다 
                const rvPosition = mapRef.rv.getPosition();

                // 지도의 중심을 현재 로드뷰의 위치로 설정합니다
                mapRef.map.setCenter(rvPosition);

                // 지도 위에 로드뷰 도로 오버레이가 추가된 상태이면
                if(overlayOn) {
                    // 마커의 위치를 현재 로드뷰의 위치로 설정합니다
                    marker.setPosition(rvPosition);
                }
            });
    

        }
    }, []);


    return (
        <div id="container">
            <div id="rvWrapper">
                <div id="roadview" style="width:100%;height:100%;"></div> <!-- 로드뷰를 표시할 div 입니다 -->
                <div id="close" title="로드뷰닫기" onclick="closeRoadview()"><span class="img"></span></div>
            </div>
            <div id="mapWrapper">
                <div id="map" style="width:100%;height:100%"></div> <!-- 지도를 표시할 div 입니다 -->
                <div id="roadviewControl" onclick="setRoadviewRoad()"></div>
            </div>
        </div>
    )
}

export default KakaoMap;
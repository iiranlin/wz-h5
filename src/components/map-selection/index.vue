<template>
  <div class="map-container">
      <div class="header-search">
        <!-- <el-amap-search-box id="search" class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" /> -->
        <span class="search-icon"><van-icon name="search" color="#888"/></span>
        <el-amap-search-box id="search" class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" />
      </div>
      <div class="content-map">
        <el-amap  class="amap-box" :zoom="amap.zoom" :center="amap.center"  :events="amap.events" :plugin="amap.pluginList" >
        <el-amap-marker v-for="(marker, index) in amap.markers" :key="'marker' + index" :position="marker.position" />
        <el-amap-text
          v-for="(marker, index) in amap.markers"
          :key="'text' + index"
          :text="marker.text"
          :offset="marker.offset"
          :position="marker.position"
        />
      </el-amap>
      <span class="location-icon" @click="hanldeObjCenter()"><van-icon name="location-o" size="0.8rem" color="#fff" /></span>
      </div>
      <div class="list-address">
        <ul>
          <li v-for="(item,index) in addrssList" :key="index" @click="handleAddrsss(item)">
            <div>
              <van-icon name="location-o"  color="#e4393c"  v-if="index==0" />
              <span v-else class="icon-radio"></span>
            </div>
            <div>
              <span v-if="index==0" style="color:#e4393c">{{item.name}}</span>
              <span v-else>{{item.name}}</span>
              <span>{{item.address}}</span>
            </div>
            <div>
              <span v-if="item.distance">{{item.distance}}m</span>
            </div> 
          </li>
        </ul>
      </div>
      
    </div>
</template>

<script>
function getFormData() {
  return {
    lat: '39.909186',
    lon: '116.39746',
    orgAddr: '区政府',
    province: '',
    city: '',
    district: '',
    
  }
}
import { AMapManager } from 'vue-amap'
import { isAndroid } from "@/utils"
const amapManager = new AMapManager()
export default {
  props: ["addrData","addr"],
  name: 'Map',
  data() {
    const vm = this
    return {
      visible: false,
      amapManager,
      // form对象
      dataForm: getFormData(),
      // 地图搜索对象
      searchOption: {
        city: '北京',
        citylimit: true
      },
      // 地图对象
      amap: {
        zoom: 15,
        center: [116.405285, 39.904989],
        pluginList: ['AMap.Geolocation'],
        events: {
          init:vm.initMap,
          click(e) {
            const { lng, lat } = e.lnglat
            vm.dataForm.lon = lng
            vm.dataForm.lat = lat
            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: 'all'
            })
            geocoder.getAddress([lng, lat], function (status, result) {
              
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  // vm.addrssList = result.regeocode.pois.sort((a, b) => a.distance - b.distance)
                  vm.addrssList = result.regeocode.pois
                  vm.formattedAddress = result.regeocode.addressComponent.province+result.regeocode.addressComponent.district+result.regeocode.addressComponent.township
                  vm.amap.markers = []
                  const obj = {
                    position: [lng, lat],
                    text: result.regeocode.formattedAddress,
                    offset: [0, 30]
                  }
                  vm.amap.markers.push(obj)
                }
              }
            })
          }
        },
        markers: [
          // {
          //   position: [116.397463, 39.909187],
          //   text: '天安门',
          //   offset: [0, 30]
          // }
        ]
      },
      formattedAddress:'',
      addrssList:[],
      map: null,
      objCenter:{}
    }
  },
  mounted() {

    if(Object.keys(this.addrData)&&Object.keys(this.addrData).length){
      this.selectMap(this.addrData.receiveraddress)
    }else if(this.addr){
      this.selectMap(this.addr)
    }else{
      this.getPosition()
    }
   
  },
  methods: {
    // 地图搜索回调
    onSearchResult(pois) {
      const vm = this
      // vm.addrssList =pois
      vm.amap.markers = []
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach((poi, index) => {
          const { lng, lat } = poi.location
          if (index === 0) {
            lngSum = lng
            latSum = lat
            const obj = {
              position: [poi.location.lng, poi.location.lat],
              text: poi.name,
              offset: [0, 30]
            }
            vm.amap.markers.push(obj)
            this.getAddress(pois[index])
          }
        })
        vm.amap.center = [lngSum, latSum]
      }
    },
    handleAddrsss(item){
      const vm =this
      this.$emit(
        'updateLocation',
        vm.formattedAddress+item.name
      )
    },
    initMap(map) {
      // 在这里调用获取当前位置的API
      this.map =map
      // this.getLocation(map)
    },
    // 获取地址
    getAddress(e){
      console.log(e)
      const vm=this
      const { lng, lat } = e.location
      // 这里通过高德 SDK 完成。
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
      geocoder.getAddress([lng, lat], function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            vm.addrssList = result.regeocode.pois
            vm.formattedAddress = result.regeocode.addressComponent.province+result.regeocode.addressComponent.district+result.regeocode.addressComponent.township
            vm.map.setZoomAndCenter(15, [lng, lat])
            vm.center = [lng, lat]
            vm.searchOption.city=result.regeocode.addressComponent.province
            vm.amap.markers = []
            const obj = {
              position: [lng, lat],
              text: result.regeocode.pois[0].name,
              offset: [0, 30]
            }
            vm.amap.markers.push(obj)
          }
        }
      })
    },
    // getLocation(map) {
    //     const geolocation = new AMap.Geolocation({
    //       // enableHighAccuracy: true, // 是否使用高精度定位，默认:true
    //       // timeout: 10000,           // 超过10秒后停止定位，默认：5s
    //       // buttonPosition: 'RB',    // 定位按钮的停靠位置
    //       // buttonOffset: new AMap.Pixel(10, 20), // 定位按钮距离对应角落的距离。默认：像素单位，例如 offset: new AMap.Pixel(10, 20)
    //       // zoomToAccuracy: true,   // 定位成功后是否自动调整地图视野到相应级别，默认：true
    //       showButton:false,
    //       showMarker:false,
          
    //     });
    //     // map.addControl(geolocation); // 将定位控件添加到地图实例中
    //     geolocation.getCurrentPosition((status, result) => {
    //       if (status === 'complete') {
    //         // 定位成功，设置地图中心点为当前位置，并设置缩放级别为15级（可根据需要调整）
    //         map.setZoomAndCenter(15, result.position); // 设置地图中心点并缩放级别到15级（可根据需要调整）
    //         this.center = result.position; // 更新组件的center数据属性，以便重新渲染地图中心点位置（可选）
    //         this.searchOption.city=result.addressComponent.province
    //       } else {

    //         this.getCityOption(geolocation,map)
    //       }
    //     });
    // },
    // getCityOption(geolocation,map){
    //    geolocation.getCityInfo((status, result) => {
    //       if (status === 'complete') {
    //         console.log(result)
    //         // 定位成功，设置地图中心点为当前位置，并设置缩放级别为15级（可根据需要调整）
    //         map.setZoomAndCenter(15, result.center); // 设置地图中心点并缩放级别到15级（可根据需要调整）
    //         this.center = result.center; // 更新组件的center数据属性，以便重新渲染地图中心点位置（可选）
    //         this.searchOption.city=result.city
    //       } else {
    //         console.error('定位失败', result); // 定位失败的处理，可根据需要调整错误提示方式或不做处理
    //       }
    //     });
    // },
    selectMap(obj){
      const vm = this
      AMap.plugin('AMap.PlaceSearch', function() {
          var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
          });
      // 关键字查询构建查询条件参数options，包括城市及关键字等请求参数。
          placeSearch.search(obj, function(status, result) { // 异步获取POI查询结果
            // 查询成功时，result即对应POI查询结果；查询失败时，返回错误号和错误信息。
            console.log(result,"查询结果"); // result即是查询结果信息，具体格式看官方文档。
            vm.onSearchResult(result.poiList.pois)
          })
       })
    },
    getPosition(){
      if(isAndroid()) {
        Android.initLocationPermission()
      }
      const vm=this
      window.getLocationPermission = (data) => {
        if(data.lng){
          let obj={
            location:{
              lng:data.lng,
              lat:data.lat
            }
          }
          vm.objCenter=obj
          vm.getAddress(obj)
        }else{
          vm.$notify({
            type: 'warning',
            message: '定位获取失败，请重新获取',
          });
        }
      }
    },
    hanldeObjCenter(){
      // if(this.objCenter && Object.keys(this.objCenter).length>0){
      //   this.getAddress(this.objCenter)
      // }else{
        this.getPosition()
      // }
      
    }
    
    
  }
}
</script>

<style lang="less" scoped>
.map-container {
  width: 100% !important;
  height: 100vh;
  margin: auto;
  overflow: hidden;
  background: #fff;
}
.header-search{
  width:100%;
  height: 1rem;
  background: #fff;
}
.search-icon{
  display: inline-block;
  position: absolute;
  z-index: 1111;
  left: 7%;
  top:0.25rem;
}
::v-deep .search-box-wrapper{
  position: absolute;
  width:90% !important;
  border-radius: 10px;
  left: 5% !important;
  background:  #fafafa;
  padding-left: 1rem;
  border: 1px solid #ddd;
  box-shadow: 0 0 5px rgba(0,0,0 0.3);
  input{
    background:  #fafafa;
  }
  .search-btn{
    display: none !important;
  }
}
// ::v-deep .search-box-wrapper::before{

// }
::v-deep .amap-controls{
  display: none;
}
.search-box {
  width: 100%;
  height: 0.8rem;
  top: 0.1rem;
 
 
  background:  #fff;
}
.el-vue-search-box-container{
  box-shadow:none;
}

.search-box .el-input {
  float: left;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 0 7px 7px 0;
  outline: none;
  position: relative;
}
.search-box .el-button {
  position: absolute;
  right: 0;
  top: 1px;
  width: 20%;
  background: #38a28a;
  border-radius: 0 7px 7px 0;
  border: none;
  color: #fff;
  outline: none;
}
::v-deep .search-tips{
  width: 100%;
  border: none !important;
  ul{
    li{
      box-shadow:none !important;
      padding: 0 5% !important;
    }
  }
}
.content-map{
  margin-top: 0;
  height: 54vh;
  position: relative;
  .location-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 1px solid #000;
    background: #000;
    position: absolute;
    bottom: 1rem;
    left:1rem;
    opacity: 0.3;

  }
}
.amap-box {
  margin-top: 0;
  height: 54vh;
  
}
.tip-box {
  text-align: center;
  width: 100%;
  position: absolute;
  top: 35px;
  padding: 10px 0;
  background-color: #fff;
  opacity: 0.8;
}
::v-deep .amap-logo {
  display: none !important;
  opacity: 0 !important;
}
::v-deep .amap-copyright {
  opacity: 0;
}
.list-address{
  background: #fff;
  height: 46vh;
  overflow: auto;
  box-sizing: border-box;
  padding-bottom: 1rem;
  ul{
    li{
      
      padding: 10px 5%;
      display: flex;
      div:nth-child(1){
        width:5%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 5px;
        .icon-radio{
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 4px solid #ddd;
        }
      }
      div:nth-child(2){
        span{
          display: block;
        }
        span:nth-child(2){
          font-size:12px;
          opacity: 0.5;
        }
      }
      div:nth-child(3){
         margin-left: auto;
          span{
            font-size:12px;
            opacity: 0.5;
          }
      }
    }
    li:first-child{
      padding-top: 0.5rem;
    }
  }
}
</style>


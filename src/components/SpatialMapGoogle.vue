<template>
  <div class="spatialSearch">
    <div id="myMap"></div>
  </div>
</template>

<script>
/* eslint-disable */
/* global Dmp:true */
import axios from 'axios'

export default {
  name: 'hello',
  data () {
    return {
      mapDrawer: false,
      mapTitle: 'Spatial Map',
      mapCenter: { lat: 61.180059, lng: -149.822075 },
      currentPlace: null
    }
  },
  mounted: function () {
    this.drawMap()
  },
  methods: {
    drawMap () {
      const vm = this
      vm.map = new google.maps.Map(document.getElementById('myMap'), {
        center: vm.mapCenter,
        scrollwheel: true,
        zoom: 12,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        rotateControl: true,
        rotateControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        fullscreenControl: true
      })
      const marker = new google.maps.Marker({
        position: vm.mapCenter,
        map: vm.map,
        title: 'Click to zoom'
      })
      marker.addListener('click', function () {
        vm.map.setZoom(16)
        vm.map.setCenter(marker.getPosition())
      })
      const token = 'eEBPeiqwW64jRXAYqYLKrttbO7m00cuMMH5fbNOS8QA='
      axios.get(
        'https://api.slickre.com/v1/spatialStream/getToken',
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        .then(function (response) {
          vm.mapToken = response.data.token
          vm.loadParcels(vm.mapToken)
        })
        .catch(function (error) {
        })
    },
    geolocate (currentPlace) {
      const vm = this
      if (currentPlace !== null) {
        vm.mapCenter = {
          lat: currentPlace.latitude,
          lng: currentPlace.longitude
        }
      } else {
        this.$http.get(
          'https://ipinfo.io/geo'
        )
          .then(response => {
            const loc = response.data.loc.split(',')
            vm.mapCenter = {
              lat: Number(loc[0]),
              lng: Number(loc[1])
            }
          }, error => {
          })
        // if (navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition(function (position) {
        //     vm.center = {
        //       lat: position.coords.latitude,
        //       lng: position.coords.longitude
        //     }
        //   })
        // }
      }
      this.drawMap()
    },
    loadParcels (token) {
      const vm = this
      Dmp.HostName = 'https://parcelstream.com/'
      Dmp.Env.Connections['SS'] = new Dmp.Conn.Connection('https://parcelstream.com/InitSession.aspx')
      Dmp.Env.Connections['SS'].init(token, function () {
        const tilelayerurl = Dmp.Env.Connections['SS'].getBaseUrl() + 'GetMap.aspx?color=0000ff&layers=ss.base.parcels/parceltiles&z={z}&y={y}&x={x}&ss_candy=' + Dmp.Env.Connections['SS']._candy
        vm.map.overlayMapTypes.push(new google.maps.ImageMapType(tilelayerurl))
        // vm.map.addLayer({
        //   'id': 'parcel-layer',
        //   'type': 'raster',
        //   'source': {
        //     'type': 'raster',
        //     'tiles': [
        //       tilelayerurl
        //     ],
        //     'tileSize': 256
        //   },
        //   'paint': {}
        // })
        // layer = new Dmp.Layer.TileLayer("SS", "Dmp_License/ParcelTiles", {
        // minZoom:16, maxZoom:19
        // });
        // map.overlayMapTypes.push(new google.maps.ImageMapType(layer));
      })
    }
  }
}
</script>

<style scoped>
#mapSearch {
  position: fixed;
  top: 60px;
  left: 10px;
  z-index: 1;
}
#mapSearch .mapAutoComplete {
  width: 100px;
}
#myMap {
  width: 100vw;
  margin-top: 50px;
  height: calc(100vh - 50px);
}
</style>

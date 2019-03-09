<template>
  <spatial-map ref="spatialSearchMap" source="map"></spatial-map>
</template>

<script>
import SpatialMap from './SpatialMapGoogle'

export default {
  components: {
    'spatial-map': SpatialMap
  }
}

</script>

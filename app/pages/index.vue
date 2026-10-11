<script lang="ts" setup>
import LayoutNav from '~/components/Layout/LayoutNav.vue';
</script>

<template>
  <LayoutNav>
    <div class="horizon-content">
      <Foooter/>
      <div class="horizon-footer">
        <span>© IMC.RE</span>
        <WidgetTranslate/>
        <Icon name="tdesign:application"/>
      </div>
    </div>
  </LayoutNav>
</template>

<style lang="scss">
.horizon-content {
  display: flex;
  align-items: flex-end;
  flex: 1;
  background-image: url(https://www.rpgfan.com/wp-content/uploads/2024/01/Arknights-Endfield-Artwork-003.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-width: 100%;
  min-height: 100%;
}
</style>

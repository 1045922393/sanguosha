<template>
  <div class="control" v-if="confirmHeros.length === 0">
    <!-- <ElInput class="control_input" v-model.number="selectNum" /> -->
    <ElSwitch v-model="isMaster" active-text="主公" inactive-text="普通" />
    <ElSlider class="control_input" v-model.number="selectNum" :min="1" :max="7"></ElSlider>
    <ElButton @click="selectHero">确定</ElButton>
  </div>
  <div class="hero_show" v-if="confirmHeros.length === 0">
    <div class="hero_item" style="width: 300px" v-for="(item, index) in showImgs" :key="index">
      <ElImage
        style="width: 100%; height: auto"
        :src="item"
        :zoom-rate="1.2"
        :preview-src-list="[item]"
        fit="cover"
      />
      <ElButton @click="confirm(item)">选择</ElButton>
    </div>
  </div>
  <div class="hero_show confirm_hero" v-else>
    <div
      class="hero_item"
      style="width: 100vw; max-width: 400px"
      v-for="(item, index) in confirmHeros"
      :key="index"
    >
      <ElImage
        style="width: 100vw; max-width: 400px; height: auto"
        :src="item"
        :zoom-rate="1.2"
        :preview-src-list="[item]"
        fit="cover"
      />
      <div class="blood_list">
        <img
          v-for="(item, index) in bloodList"
          :key="index"
          style="width: 70px; height: auto; margin: 5px; border-radius: 50%"
          src="@/assets/blood.jpg"
          @click="handleClickBlood(item, index)"
          class="bloodItem"
          :class="{
            scaleSmall: item,
          }"
        />
      </div>
      <ElSlider
        class="control_input blood_control"
        style="width: 100vw; max-width: 350px"
        v-model.number="bloodNum"
        :min="0"
        :max="8"
      ></ElSlider>
    </div>
  </div>
</template>
<script setup>
import { ElSwitch, ElImage, ElButton, ElInput, ElSlider } from 'element-plus';
import NoSleep from 'nosleep.js/dist/NoSleep.min.js';
import herosDirect, { masterList } from './herosList';

const selectNum = ref(3);
const allImgs = ref([]);
const showImgs = ref([]);
const initDone = ref(true);
const confirmHeros = ref([]);
const isMaster = ref(false);
const imgPreUrl = import.meta.env.Prod
  ? '/sgsDist'
  : 'https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/sgsDist';

function noSleep() {
  let noSleep = new NoSleep();
  document.addEventListener(
    'click',
    function enableNoSleep() {
      noSleep.enable();
      document.removeEventListener('click', enableNoSleep, false);
    },
    false,
  );
}

// [min,max]
const random = (min = 1, max = 10) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const deepClone = (target) => {
  return JSON.parse(JSON.stringify(target));
};

const loadPng = async (country) => {
  const list = [];
  for (const png in heros) {
    if (png.includes(country)) {
      list.push((await heros[png]()).default);
    }
  }
  return list;
};

const module2Src = async (heros) => {
  const imgs = [];
  for (const png of heros) {
    const res = await png();
    imgs.push(res.default);
  }
  return imgs;
};

const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
};

const splitFetch = async (heros) => {
  const herosArr = Object.values(heros);
  const imgs = await module2Src(herosArr);
  allImgs.value = allImgs.value.concat(imgs);
  await sleep();
};

onMounted(async () => {
  allImgs.value = herosDirect.map((item) => `${imgPreUrl}${item}`);
  initDone.value = false;
  noSleep();
});

// 重复了就继续查找
const getRandomAndPush = (arr = [], AllArr = allImgs.value) => {
  const randIndex = random(0, AllArr.length - 1);
  if (deepClone(arr).includes(randIndex)) {
    return getRandomAndPush(arr, AllArr);
  } else {
    return randIndex;
  }
};

const selectHero = () => {
  const heroIndex = [];
  if (isMaster.value) {
    for (let index = 0; index < selectNum.value; index++) {
      heroIndex.push(getRandomAndPush(heroIndex, masterList));
    }
    showImgs.value = heroIndex
      .map((item) => {
        return masterList[item];
      })
      .map((item) => {
        return allImgs.value.find((urlItem) => urlItem.includes(item));
      });
  } else {
    for (let index = 0; index < selectNum.value; index++) {
      heroIndex.push(getRandomAndPush(heroIndex));
    }
    showImgs.value = heroIndex.map((item) => {
      return allImgs.value[item];
    });
  }

  confirmHeros.value = [];
};

const confirm = (imgSrc) => {
  confirmHeros.value.push(imgSrc);
};

const bloodNum = ref(4);
const bloodList = ref([]);

watch(
  () => bloodNum.value,
  (newVal) => {
    bloodList.value = new Array(newVal).fill(false);
  },
  {
    immediate: true,
  },
);

function handleClickBlood(item, index) {
  bloodList.value[index] = !item;
}
</script>
<style>
:root {
  --el-color-primary: #2d2d2d !important;
}
.el-slider {
  --el-slider-button-size: 14px !important;
}
.el-button {
  padding: 0 8px !important;
}
</style>
<style lang="less" scoped>
.control {
  padding: 10px;
  display: flex;
  justify-content: center;

  .control_input {
    width: 200px;
    margin: 0 18px;
  }
}
.blood_control {
  position: fixed;
  bottom: 0;
}
.hero_show {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  &.confirm_hero {
    height: 100vh;
    align-content: center;

    .hero_item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .blood_list {
      max-width: 100vw;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .bloodItem {
        transition: all 0.3s;
      }
      .scaleSmall {
        transform: scale(0.6);
        filter: brightness(0.4);
      }
    }
  }

  .hero_item {
    margin: 6px;
    text-align: center;
  }
}

:deep(.el-image-viewer__canvas) {
  img {
    width: auto;
    height: auto;
  }
}
</style>

<template>
  <ElIcon class="refresh icon" @click="handleRefreshPage" v-if="confirmHeros.length !== 0"
    ><RefreshLeft
  /></ElIcon>
  <ElIcon class="pushHero icon" v-if="isZuoCi" @click="handlePushHero">
    <Plus />
  </ElIcon>
  <span class="ZuoCiHeroNum" v-if="isZuoCi">{{ ZuoCiHeros.length }}</span>
  <div class="control" v-if="confirmHeros.length === 0">
    <!-- <ElInput class="control_input" v-model.number="selectNum" /> -->
    <ElSwitch v-model="isMaster" active-text="主公" inactive-text="普通" />
    <ElSlider class="control_input" v-model.number="selectNum" :min="1" :max="7"></ElSlider>
    <ElButton @click="selectHero">确定</ElButton>
  </div>
  <div class="hero_show" v-if="confirmHeros.length === 0">
    <div class="hero_item" style="width: 300px" v-for="(item, index) in showImgs" :key="index">
      <ElImage
        class="hero_item_img"
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
        :preview-src-list="previewSrcListComp(item)"
        fit="cover"
        class="hero_item_img"
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
        :min="1"
        :max="10"
      ></ElSlider>
    </div>
  </div>
</template>
<script setup>
import { ElIcon, ElSwitch, ElImage, ElButton, ElInput, ElSlider } from 'element-plus';
import { RefreshLeft, Plus } from '@element-plus/icons-vue';
import NoSleep from 'nosleep.js/dist/NoSleep.min.js';
import herosDirect, { masterList, zuoCiIds } from './herosList';

const selectNum = ref(3);
const allImgs = ref([]); // string[]
const showImgs = ref([]); // string[]
const initDone = ref(true);

const isMaster = ref(false);
const imgPreUrl = import.meta.env.Prod
  ? '/sgsDist'
  : 'https://static-mp-1c925fd0-d9e0-409d-b254-d061358b31f9.next.bspapp.com/sgsDist';
const confirmHeros = ref([]); // string[]

const isZuoCi = computed(() => {
  let temp = false;
  confirmHeros.value.forEach((item) => {
    if (temp) return;
    if (zuoCiIds.find((id) => item.includes(id))) temp = true;
  });
  // confirmHeros.value;
  return temp;
});

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

const handleRefreshPage = () => {
  confirmHeros.value = [];
  bloodList.value = bloodList.value.map(() => false);
  // 清空座次
  ZuoCiHeros.value = [];
};

function handleClickBlood(item, index) {
  bloodList.value[index] = !item;
}

// 左慈逻辑
const ZuoCiHeros = ref([]);

function handlePushHero() {
  ZuoCiHeros.value.push(allImgs.value[getRandomAndPush([])]);
}

function previewSrcListComp(item) {
  if (isZuoCi.value) {
    return [item, ...ZuoCiHeros.value];
  } else {
    return [item];
  }
}
</script>
<style lang="less">
:root {
  --el-color-primary: #2d2d2d !important;
}
.el-slider {
  --el-slider-button-size: 14px !important;
}
body {
  .el-button {
    border-radius: 16px;
  }
}
</style>
<style lang="less" scoped>
.refresh {
  position: fixed;
  top: 4px;
  left: 4px;
}

.pushHero {
  position: fixed;
  top: 4px;
  right: 4px;
}

.ZuoCiHeroNum {
  position: fixed;
  left: 48%;
  top: 4px;
}
.icon {
  font-size: 20px;
  z-index: 100;
}
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

  .hero_item_img {
    border-radius: 12px;
    border: 1px solid #9f7f5b;
    box-shadow: 0 0 2px 2px #fff;
  }
}

:deep(.el-image-viewer__canvas) {
  img {
    width: auto;
    height: auto;
  }
}
</style>

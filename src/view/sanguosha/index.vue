<template>
  <div class="control" v-if="confirmHeros.length === 0">
    <!-- <ElInput class="control_input" v-model.number="selectNum" /> -->
    <ElSlider class="control_input" v-model.number="selectNum" :min="1" :max="7"></ElSlider>
    <ElButton :disabled="initDone" @click="selectHero">确定</ElButton>
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
    <div class="hero_item" style="width: 300px" v-for="(item, index) in confirmHeros" :key="index">
      <ElImage
        style="width: 100%; height: auto"
        :src="item"
        :zoom-rate="1.2"
        :preview-src-list="[item]"
        fit="cover"
      />
    </div>
  </div>
</template>
<script setup>
import { ElImage, ElButton, ElInput, ElSlider } from 'element-plus';
import NoSleep from 'nosleep.js/dist/NoSleep.min.js';

const selectNum = ref(3);
const allImgs = ref([]);
const showImgs = ref([]);
const initDone = ref(true);
const heros = import.meta.glob('./heros/**/*.png');
const confirmHeros = ref([]);

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
  for (const png in heros) {
    const res = await heros[png]();
    imgs.push(res.default);
  }
  return imgs;
};
onMounted(async () => {
  const imgs = await module2Src(heros);
  allImgs.value = imgs;
  initDone.value = false;
  noSleep();
});

// 重复了就继续查找
const getRandomAndPush = (arr = []) => {
  const randIndex = random(0, allImgs.value.length - 1);
  if (deepClone(arr).includes(randIndex)) {
    return getRandomAndPush(arr);
  } else {
    return randIndex;
  }
};

const selectHero = () => {
  const heroIndex = [];
  for (let index = 0; index < selectNum.value; index++) {
    heroIndex.push(getRandomAndPush(heroIndex));
  }
  showImgs.value = heroIndex.map((item) => {
    return allImgs.value[item];
  });
  confirmHeros.value = [];
};

const confirm = (imgSrc) => {
  confirmHeros.value.push(imgSrc);
};
</script>

<style lang="less" scoped>
.control {
  padding: 10px;
  display: flex;
  justify-content: center;

  .control_input {
    width: 200px;
    margin-right: 18px;
  }
}
.hero_show {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  &.confirm_hero {
    height: 100vh;
    align-content: center;
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

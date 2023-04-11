copyFileSync(
  './patches/vite/publicUtils.cjs',
  './node_modules/.pnpm/vite@3.1.0_less@4.1.3/node_modules/vite/dist/node-cjs/publicUtils.cjs',
);
copyFileSync(
  './patches/vite/index.cjs',
  './node_modules/.pnpm/@vitejs+plugin-vue@3.1.0_vite@3.1.0+vue@3.2.39/node_modules/@vitejs/plugin-vue/dist/index.cjs',
);

function copyFileSync(source, target) {
  var targetFile = target;
  const fs = require('fs');
  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

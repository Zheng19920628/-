/**
 * 小学科学虚拟实验 - 交互实验脚本
 */

document.addEventListener('DOMContentLoaded', () => {
  initCircuitLab();
  initBuoyancyLab();
  initDissolveLab();
  initPhLab();
  initPlantLab();
});

/** 简单电路实验 */
function initCircuitLab() {
  const board = document.getElementById('circuit-board');
  const result = document.getElementById('circuit-result');
  if (!board || !result) return;

  const items = board.querySelectorAll('.circuit-item');
  const bulb = board.querySelector('.bulb');
  let selected = new Set();

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.part;
      if (selected.has(id)) {
        selected.delete(id);
        item.classList.remove('selected');
      } else {
        selected.add(id);
        item.classList.add('selected');
      }
      updateCircuit();
    });
  });

  function updateCircuit() {
    const hasBattery = selected.has('battery');
    const hasBulb = selected.has('bulb');
    const hasSwitch = selected.has('switch');
    const switchOn = selected.has('switch-on');

    if (hasBattery && hasBulb && hasSwitch && switchOn) {
      bulb.classList.remove('bulb-off');
      bulb.classList.add('bulb-on');
      result.textContent = '✅ 电路连通！灯泡亮了。电流从电池正极流出，经过开关和灯泡，回到负极。';
    } else if (hasBattery && hasBulb && hasSwitch) {
      bulb.classList.add('bulb-off');
      bulb.classList.remove('bulb-on');
      result.textContent = '⚠️ 开关未闭合，电路断开，灯泡不亮。点击"闭合开关"试试！';
    } else {
      bulb.classList.add('bulb-off');
      bulb.classList.remove('bulb-on');
      result.textContent = '💡 请点击选择：电池、灯泡、开关，然后闭合开关组成完整电路。';
    }
  }

  updateCircuit();
}

/** 浮力实验 */
function initBuoyancyLab() {
  const tank = document.getElementById('buoyancy-tank');
  const result = document.getElementById('buoyancy-result');
  if (!tank || !result) return;

  const objects = tank.querySelectorAll('.buoyancy-object');
  const waterLine = 0.4;

  objects.forEach(obj => {
    obj.addEventListener('click', () => {
      const density = parseFloat(obj.dataset.density);
      const tankRect = tank.getBoundingClientRect();
      const objHeight = obj.offsetHeight;

      let topPercent;
      if (density < 1) {
        topPercent = (waterLine * 100) - (objHeight / tankRect.height * 100 * 0.6);
        result.textContent = `🪵 ${obj.dataset.name}密度小于水，浮在水面上！`;
      } else {
        topPercent = 75;
        result.textContent = `⚙️ ${obj.dataset.name}密度大于水，沉入水底！`;
      }

      obj.style.top = topPercent + '%';
    });
  });
}

/** 溶解实验 */
function initDissolveLab() {
  const cup = document.getElementById('dissolve-cup');
  const liquid = document.getElementById('dissolve-liquid');
  const result = document.getElementById('dissolve-result');
  const buttons = document.querySelectorAll('[data-dissolve]');
  if (!cup || !liquid || !result) return;

  let saltAmount = 0;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.dissolve;
      if (action === 'add-salt') {
        saltAmount = Math.min(saltAmount + 1, 5);
      } else if (action === 'add-hot') {
        saltAmount = Math.min(saltAmount + 2, 5);
      } else if (action === 'reset') {
        saltAmount = 0;
      }

      liquid.style.height = (40 + saltAmount * 8) + '%';

      if (saltAmount === 0) {
        liquid.style.background = 'rgba(72, 202, 228, 0.7)';
        result.textContent = '💧 清水中还没有溶解任何物质。';
      } else if (saltAmount <= 2) {
        liquid.style.background = 'rgba(72, 202, 228, 0.85)';
        result.textContent = '🧂 盐正在溶解中… 水变得稍微浑浊了。';
      } else if (saltAmount <= 4) {
        liquid.style.background = 'rgba(100, 180, 200, 0.9)';
        result.textContent = '🌡️ 加热水可以加快溶解速度！更多盐被溶解了。';
      } else {
        liquid.style.background = 'rgba(120, 160, 180, 1)';
        result.textContent = '⚠️ 溶液已达饱和！多余的盐不再溶解，沉在杯底。';
      }
    });
  });
}

/** pH 指示剂实验 */
function initPhLab() {
  const items = document.querySelectorAll('.ph-item');
  const result = document.getElementById('ph-result');
  if (!items.length || !result) return;

  const phData = {
    lemon: { color: '#ff6b6b', text: '柠檬汁呈酸性（pH≈2），紫色石蕊试液变红。' },
    soap: { color: '#4ecdc4', text: '肥皂水呈碱性（pH≈9），紫色石蕊试液变蓝。' },
    water: { color: '#95e1d3', text: '纯水是中性（pH=7），石蕊试液不变色。' },
    vinegar: { color: '#feca57', text: '醋呈酸性（pH≈3），紫色石蕊试液变红。' }
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const key = item.dataset.ph;
      const data = phData[key];
      if (data) {
        document.getElementById('ph-indicator').style.background = data.color;
        result.textContent = '🧪 ' + data.text;
      }
    });
  });
}

/** 植物生长实验 */
function initPlantLab() {
  const stages = document.querySelectorAll('.plant-stage');
  const result = document.getElementById('plant-result');
  if (!stages.length || !result) return;

  const stageTexts = [
    '🌰 种子吸水膨胀，准备萌发。',
    '🌱 种子破土而出，长出幼芽。',
    '🌿 植株长出真叶，开始进行光合作用。',
    '🌸 植物开花，准备繁殖。',
    '🍎 结出果实，完成生命周期。'
  ];

  stages.forEach((stage, index) => {
    stage.addEventListener('click', () => {
      stages.forEach(s => s.classList.remove('active'));
      stage.classList.add('active');
      result.textContent = stageTexts[index];
    });
  });
}

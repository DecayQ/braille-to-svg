/**
 * 将盲文字符串转换为SVG图形
 * @param {string} braStr - 盲文字符串
 * @param {Object} options - 配置选项
 * @returns {string} SVG字符串
 */
const BrailleToSVG = (braStr, options = {}) => {
  const {
    dotRadius = 3,
    cellWidth = 10,
    cellHeight = 10,
    charSpacing = 5,
    dotColor = "black",
    svgWidth = null,
    svgHeight = 40,
    backgroundColor = "transparent",
  } = options;

  const tokens = braStr.split("");
  let circles = [];
  let currentX = cellWidth / 2;

  tokens.forEach((token) => {
    const charCircles = getCharCircles(
      token,
      currentX,
      cellWidth,
      cellHeight,
      dotRadius,
      dotColor
    );
    circles = circles.concat(charCircles);
    currentX += 2 * cellWidth + charSpacing;
  });

  const totalWidth = svgWidth || currentX - charSpacing + cellWidth / 2;

  const backgroundRect =
    backgroundColor !== "transparent"
      ? `<rect width="100%" height="100%" fill="${backgroundColor}"/>`
      : "";

  return `
<svg width="${totalWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  ${backgroundRect}
  ${circles.join("\n  ")}
</svg>`;
};

/**
 * 判断是否是盲文字符串
 * @param {string} str - 盲文字符串
 * @returns {boolean} 是否为有效盲文字符串
 */
const isBrailleString = (str) => {
  const brailleRegex = /^[\u2800-\u28FF\s]+$/;
  return brailleRegex.test(str);
};

/**
 * 将单个盲文字符转换为圆点数组
 */
const getCharCircles = (
  brailleChar,
  startX,
  cellWidth,
  cellHeight,
  dotRadius,
  dotColor
) => {
  const dots = brailleCharToDots(brailleChar);
  const circles = [];

  // 盲文点阵布局 (2x3):
  // 列0: 点1(上), 点2(中), 点3(下)
  // 列1: 点4(上), 点5(中), 点6(下)
  dots.forEach((dotNum) => {
    const col = dotNum <= 3 ? 0 : 1;
    const row = (dotNum - 1) % 3;
    const cx = startX + col * cellWidth;
    const cy = row * cellHeight + cellHeight / 2;
    circles.push(
      `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${dotColor}"/>`
    );
  });

  return circles;
};

/**
 * 通过Unicode编码计算盲文字符的点阵
 * 盲文Unicode范围: U+2800 到 U+28FF
 * 编码规则: 每个字符是一个8位字节，位对应关系:
 * 位0: 点1 | 位1: 点2 | 位2: 点3 | 位3: 点4
 * 位4: 点5 | 位5: 点6 | 位6: 点7 | 位7: 点8
 * (标准6点盲文只使用前6位)
 */
const brailleCharToDots = (brailleChar) => {
  const brailleBase = 0x2800;
  const charCode = brailleChar.charCodeAt(0);

  // 检查是否为有效盲文字符
  if (charCode < brailleBase || charCode > brailleBase + 255) {
    console.warn(`无效的盲文字符: ${brailleChar}`);
    return [];
  }

  const dotValue = charCode - brailleBase;
  const dots = [];

  // 检查前6位（标准6点盲文）
  for (let i = 0; i < 6; i++) {
    if (dotValue & (1 << i)) {
      dots.push(i + 1); // 位0对应点1，位1对应点2，依此类推
    }
  }

  return dots;
};

// 使用示例和测试函数
const testBrailleToSVG = () => {
  // 测试字符串：您提供的盲文示例
  const testBraille = "⠙⠪⠆⠵⠷⠄⠌⠢⠆⠏⠩⠆⠓⠪⠄";

  console.log("=== 盲文转SVG测试 ===");
  console.log("输入:", testBraille);
  console.log("字符数:", testBraille.length);

  // 测试单个字符解析
  testBraille.split("").forEach((char, index) => {
    const dots = brailleCharToDots(char);
    console.log(`字符 ${index}: '${char}' -> 点阵: [${dots.join(",")}]`);
  });

  // 生成SVG
  const svgResult = BrailleToSVG(testBraille, {
    dotRadius: 4,
    cellWidth: 12,
    cellHeight: 12,
    charSpacing: 8,
    dotColor: "#2c5aa0",
    backgroundColor: "#f0f8ff",
  });

  console.log("生成的SVG:");
  console.log(svgResult);

  // 如果在浏览器环境中，显示SVG
  if (typeof document !== "undefined") {
    document.body.innerHTML = `
      <h3>盲文SVG显示测试:</h3>
      <div>输入: "${testBraille}"</div>
      ${svgResult}
    `;
  }

  return svgResult;
};

// 导出函数
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BrailleToSVG,
    brailleCharToDots,
    getCharCircles,
    testBrailleToSVG,
    isBrailleString,
  };
}

let genotypeStats = {
 'PP': 0,
 'Pp': 0,
 'pp': 0
};
let phenotypeStats = {
 'P_': 0,
 'pp': 0
};
let femaleGamete = '';
let maleGamete = '';
let totalSimulations = 0;
const femaleGameteBtns = document.querySelectorAll('#female-gamete-btn');
const maleGameteBtns = document.querySelectorAll('#male-gamete-btn');
const fertilizationBtn = document.getElementById('fertilization-btn');
const singleSimBtn = document.getElementById('single-sim');
const sim10Btn = document.getElementById('sim-10');
const sim100Btn = document.getElementById('sim-100');
const sim1000Btn = document.getElementById('sim-1000');
const statsBtn = document.getElementById('stats-btn');
const clearBtn = document.getElementById('clear-btn');
statsBtn.textContent = '统计总数(0)';
updateTables();
const femalePBox = document.getElementById('female-p-box');
const malePBox = document.getElementById('male-p-box');
const femaleGameteBox = document.getElementById('female-gamete');
const maleGameteBox = document.getElementById('male-gamete');
const f2ResultBox = document.getElementById('f2-result');
const phenotypeResultBox = document.getElementById('phenotype-result');
function generateRandomGene(gene1, gene2) {
 return Math.random() < 0.5 ? gene1 : gene2;
}
function formGamete(isFemaleSide) {
 const p = generateRandomGene('P', 'p');
 if (isFemaleSide) {
 femalePBox.textContent = p;
 femaleGamete = p;
 femaleGameteBox.textContent = femaleGamete;
 } else {
 malePBox.textContent = p;
 maleGamete = p;
 maleGameteBox.textContent = maleGamete;
 }
}
function completeFertilization() {
 if (!femaleGamete || !maleGamete) {
 alert('请先形成两个配子!');
 return;
 }
 let genotype = sortGenes(femaleGamete, maleGamete);
 f2ResultBox.textContent = genotype;
 const phenotype = determinePhenotype(genotype);
 phenotypeResultBox.textContent = phenotype;
 updateStats(genotype);
 updateTables();
}
function sortGenes(gene1, gene2) {
 if (gene1 === gene2) {
 return gene1 + gene2;
 }
 if ((gene1 === 'P' && gene2 === 'p') || (gene1 === 'p' && gene2 === 'P')) {
 return 'Pp';
 }
 return gene1 + gene2;
}
function determinePhenotype(genotype) {
 const flowerDisplay = document.getElementById('flower-display');
 if (genotype.includes('P')) {
 flowerDisplay.innerHTML = '<img src="紫花.png" alt="紫花">';
 return "紫花";
 } else {
 flowerDisplay.innerHTML = '<img src="白花.png" alt="白花">';
 return "白花";
 }
}
function updateStats(genotype) {
 if (genotype === 'pP') {
 genotype = 'Pp';
 }
 genotypeStats[genotype]++;
 totalSimulations++;
 if (genotype.includes('P')) {
 phenotypeStats['P_']++;
 } else {
 phenotypeStats['pp']++;
 }
 statsBtn.textContent = `统计总数(${totalSimulations})`;
}
function updateTables() {
 if (totalSimulations === 0) {
 document.querySelectorAll('.stats-table .number').forEach(cell => {
 cell.textContent = '';
 });
 return;
 }
 const ppCount = genotypeStats['pp'] || 0;
 const whiteCount = phenotypeStats['pp'] || 0;
 document.querySelectorAll('.genotype-stats-column .stats-table tbody tr').forEach(row => {
 const genotype = row.cells[0].textContent;
 const count = genotypeStats[genotype] || 0;
 row.cells[1].textContent = count > 0 ? count : '';
 row.cells[2].textContent = (ppCount > 0 && count > 0) ? (count / ppCount).toFixed(2) : '';
 });
 const phenotypeMap = {
 'P_紫花': 'P_',
 'pp白花': 'pp'
 };
 document.querySelectorAll('.phenotype-stats-column .stats-table tbody tr').forEach(row => {
 const phenotypeName = row.cells[0].textContent;
 const key = phenotypeMap[phenotypeName];
 if (key) {
 const count = phenotypeStats[key] || 0;
 row.cells[1].textContent = count > 0 ? count : '';
 row.cells[2].textContent = (whiteCount > 0 && count > 0) ? (count / whiteCount).toFixed(2) : '';
 }
 });
}
function clearAll() {
 Object.keys(genotypeStats).forEach(key => genotypeStats[key] = 0);
 Object.keys(phenotypeStats).forEach(key => phenotypeStats[key] = 0);
 totalSimulations = 0;
 femaleGamete = '';
 maleGamete = '';
 femaleGameteBox.textContent = '';
 maleGameteBox.textContent = '';
 f2ResultBox.textContent = '';
 phenotypeResultBox.textContent = '';
 femalePBox.textContent = '';
 malePBox.textContent = '';
 document.getElementById('flower-display').innerHTML = '';
 statsBtn.textContent = '统计总数(0)';
 updateTables();
}
function multipleSimulations(times) {
 for (let i = 0; i < times; i++) {
 formGamete(true);
 formGamete(false);
 completeFertilization();
 }
}
function setupDraggable() {
 const donateBtn = document.getElementById('donate-trigger');
 let isDragging = false;
 let startX, startY;
 let initialX = 30;
 let initialY = window.innerHeight - 60;
 let dragStartTime = 0;
 function onMouseDown(e) {
 isDragging = true;
 dragStartTime = Date.now();
 const touch = e.touches ? e.touches[0] : e;
 startX = touch.clientX - donateBtn.offsetLeft;
 startY = touch.clientY - donateBtn.offsetTop;
 donateBtn.style.transition = 'none';
 donateBtn.style.cursor = 'grabbing';
 }
 function onMouseMove(e) {
 if (!isDragging) return;
 e.preventDefault();
 const touch = e.touches ? e.touches[0] : e;
 let newX = touch.clientX - startX;
 let newY = touch.clientY - startY;
 newX = Math.max(0, Math.min(window.innerWidth - donateBtn.offsetWidth, newX));
 newY = Math.max(0, Math.min(window.innerHeight - donateBtn.offsetHeight, newY));
 donateBtn.style.left = newX + 'px';
 donateBtn.style.top = newY + 'px';
 donateBtn.style.bottom = 'auto';
 }
 function onMouseUp(e) {
 if (isDragging) {
 const dragEndTime = Date.now();
 const dragDuration = dragEndTime - dragStartTime;
 if (dragDuration < 200) {
 document.getElementById('donate-panel').style.display = 'block';
 document.getElementById('overlay').style.display = 'block';
 }
 }
 isDragging = false;
 donateBtn.style.cursor = 'grab';
 donateBtn.style.transition = 'transform 0.2s';
 }
 donateBtn.style.position = 'fixed';
 donateBtn.style.left = initialX + 'px';
 donateBtn.style.top = initialY + 'px';
 donateBtn.style.bottom = 'auto';
 donateBtn.style.cursor = 'grab';
 donateBtn.addEventListener('mousedown', onMouseDown);
 document.addEventListener('mousemove', onMouseMove);
 document.addEventListener('mouseup', onMouseUp);
 donateBtn.addEventListener('touchstart', onMouseDown);
 document.addEventListener('touchmove', onMouseMove);
 document.addEventListener('touchend', onMouseUp);
}
document.addEventListener('DOMContentLoaded', function() {
 setupDraggable();
 document.getElementById('overlay').addEventListener('click', () => {
 document.getElementById('donate-panel').style.display = 'none';
 document.getElementById('overlay').style.display = 'none';
 });
 document.querySelector('.close-section').addEventListener('click', () => {
 const panel = document.getElementById('donate-panel');
 panel.querySelector('.donate-content').classList.add('panel-closing');
 setTimeout(() => {
 panel.style.display = 'none';
 document.getElementById('overlay').style.display = 'none';
 panel.querySelector('.donate-content').classList.remove('panel-closing');
 }, 500);
 });
});
document.getElementById('female-gamete-btn').addEventListener('click', () => formGamete(true));
document.getElementById('male-gamete-btn').addEventListener('click', () => formGamete(false));
fertilizationBtn.addEventListener('click', completeFertilization);
singleSimBtn.addEventListener('click', () => multipleSimulations(1));
sim10Btn.addEventListener('click', () => multipleSimulations(10));
sim100Btn.addEventListener('click', () => multipleSimulations(100));
sim1000Btn.addEventListener('click', () => multipleSimulations(1000));
clearBtn.addEventListener('click', clearAll);
const modal = document.getElementById('rules-modal');
const helpBtn = document.getElementById('help-btn');
const closeBtn = document.querySelector('.close-button');
helpBtn.onclick = function() {
 modal.style.display = "block";
}
closeBtn.onclick = function() {
 modal.style.display = "none";
}
window.onclick = function(event) {
 if (event.target == modal) {
 modal.style.display = "none";
 }
}
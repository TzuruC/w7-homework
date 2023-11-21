import axios, { isCancel, AxiosError } from 'axios';

let data;
let newData = [];
const dataUrl = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';

function renderCards(data) {
    // initCard
    ticketCardArea.innerHTML = '';

    // renderAllCardHTML
    data.forEach((card) => {
        ticketCardArea.innerHTML += `
    <li class="ticketCard">
        <div class="ticketCard-img">
            <a href="#">
                <img src="${card.imgUrl}" alt="">
            </a>
            <div class="ticketCard-region">${card.area}</div>
            <div class="ticketCard-rank">${card.rate}</div>
        </div>
        <div class="ticketCard-content">
            <div>
                <h3>
                    <a href="#" class="ticketCard-name">${card.name}</a>
                </h3>
                <p class="ticketCard-description">
                    ${card.description}
                </p>
            </div>
            <div class="ticketCard-info">
                <p class="ticketCard-num">
                    <span><i class="fas fa-exclamation-circle"></i></span>
                    剩下最後 <span id="ticketCard-num"> ${card.group} </span> 組
                </p>
                <p class="ticketCard-price">
                    TWD <span id="ticketCard-price">$${card.price}</span>
                </p>
            </div>
        </div>
    </li>`;
    });

    // renderChart
    let totalObj = {};
    data.forEach(function (item, index) {
        if (totalObj[item.area] == undefined) {
            totalObj[item.area] = 1;
        } else {
            totalObj[item.area] += 1;
        }
    })

    let areaChartData = []; // areaChartData = [["高雄", 2], ["台北",1], ["台中", 1]]
    let area = Object.keys(totalObj); // area output ["高雄","台北","台中"]    
    area.forEach(function (item, index) {
        let ary = [];
        ary.push(item);
        ary.push(totalObj[item]);
        areaChartData.push(ary);
    })

    var chart = c3.generate({
        data: {
            columns: areaChartData,
            type: 'donut',
            colors: {
                "高雄": "#E68618",
                "台中": "#5151D3",
                "台北": "#26BFC7"
            }
        },
        donut: {
            title: "套票地區比重",
            width: 20, //粗細
            label: {
                show: false
            }
        },
        size: {
            height: 240,
            width: 480
        }
    });
}

function getCardValue() {
    let obj = {
        id: 0,
        name: ticketName.value,
        imgUrl: ticketImgUrl.value,
        area: ticketRegion.value,
        description: ticketDescription.value,
        group: ticketNum.value,
        price: ticketPrice.value,
        rate: ticketRate.value,
    };

    axios
        .get(dataUrl)
        .then(function (res) {
            data = res.data.data;
            newData = [...data, obj];
            addTicketForm.reset();
            handleSearchResult(newData);
        })
        .catch(function (error) {
            console.log(error);
        });
    alert('新增成功！');
}

function handleSearchResult(filteredData) {
    renderCards(filteredData);
    searchResult.textContent = `本次搜尋共 ${filteredData.length} 筆資料`;
}

function fetchDataAndRender() {
    axios
        .get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
        .then(function (res) {
            // 資料取得成功後的處理
            data = res.data.data;
            renderCards(data);
        })
        .catch(function (error) {
            // 處理錯誤
            console.log(error);
        });
}

const addTicketForm = document.querySelector('.addTicket-form');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketRegion = document.querySelector('#ticketRegion');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketNum = document.querySelector('#ticketNum');
const ticketRate = document.querySelector('#ticketRate');
const ticketDescription = document.querySelector('#ticketDescription');
const ticketCardArea = document.querySelector('.ticketCard-area');
const searchResult = document.querySelector('#searchResult-text');
const regionSearch = document.querySelector('.regionSearch');
const addTicketBtn = document.querySelector('.addTicket-btn');

// 初始渲染
fetchDataAndRender();

addTicketBtn.addEventListener('click', function (e) {
    e.preventDefault();
    getCardValue();
    renderCards(data);
    // console.log(newData);
});

regionSearch.addEventListener('change', function (e) {
    let cardTarget = e.target.value;
    let filteredData = data.filter((card) => card.area === cardTarget || cardTarget === '');
    handleSearchResult(filteredData);
});

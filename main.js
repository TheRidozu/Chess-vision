window.addEventListener('DOMContentLoaded', () => {


    // Elementy HTML
    const chessBoard = document.querySelector('.chess-board'),
          sideBar = document.querySelector('.sidebar .fieldIndex'),
          startBtn = document.querySelector('.startBtn'),
          scoreSection = document.querySelector('.score');
          timeSection = document.querySelector('.time');
          checkBoxes = document.querySelector('.checkboxes'),
          statsBtn = document.querySelector('.statsBtn'),
          statsSection = document.querySelector('.stats');
          averageSection = document.querySelector('.average');

    // zmienne globalne
    let score = 0, fieldIndex = null, tryNumber = 0, average=0;;

    const fieldsArray = new Array(8); // Stworzenie tablicy 
    
    // Stworzenie drugiego wymiaru
    for(let i=0; i<fieldsArray.length; i++){
        fieldsArray[i] = new Array(8);   
    }
    
    // Wypełnienie tablicy, przypisanie kolorów oraz współrzędnych
    for(let i=0; i<fieldsArray.length; i++){
        for(let j=0; j<fieldsArray.length; j++){
            if( (i+j) % 2 == 0){
                fieldsArray[i][j] = document.createElement('div');
                fieldsArray[i][j].className = "field black";
            }else{
                fieldsArray[i][j] = document.createElement('div');
                fieldsArray[i][j].className = "field white";
            }
            fieldsArray[i][j].dataset.index = `${String.fromCharCode(j+65)}${8-i}`;
            fieldsArray[i][j].addEventListener('click', scoredfieldIndex);
            chessBoard.appendChild(fieldsArray[i][j]);
        }
    }
    
    //nasłuchiwacze zdarzeń

    startBtn.addEventListener("click", startGame);
    statsBtn.addEventListener("click",() =>{
        if(statsSection.classList.contains("active")){
            statsSection.classList.remove("active");
        }else{
            statsSection.classList.add("active");
        }
    });

    // Funkcje 

    function scoredfieldIndex(e){
        const correctField = document.querySelector(`.field[data-index=${fieldIndex}]`);
        let elementChebox = '';
        if(startBtn.disabled == false){
            return;
        }else{
            if(e.target.getAttribute('data-index') == fieldIndex){
                score++;
                setScore();
                elementChebox =  `
                <div>
                    <img src="img/correct.svg"/>
                    <span class="successCheckbox">${fieldIndex}</span>
                </div>`;
            }else{
                e.target.classList.add("fail");
                elementChebox =  `
                <div>
                    <img src="img/uncorrect.svg"/>
                    <span class="failCheckbox">${fieldIndex}</span>
                </div>`;
            }
            checkBoxes.innerHTML += elementChebox;
            correctField.classList.add("success");
            drawIndex();
            setTimeout(()=>clearFieldColors(e.target, correctField),300);
        }
    }

    function setScore(){
        scoreSection.innerHTML = score;
    }

    function startGame(e){
        score = 0;
        e.target.disabled = true;
        drawIndex();
        setTime(30);
        setScore();
        checkBoxes.innerHTML = "";
    }
    
    function setTime(n){
        timeSection.innerHTML = `
            <img src="img/watch.png" alt="watch" class="watch"/>
            ${n>=10? `0:${n}` : `0:0${n}`}`;
        if(n != 0){
            setTimeout(() => {
                setTime(--n);
            }, 1000);
        }else{
            startBtn.disabled = false;
            addData(chart, `${++tryNumber} próba`, score);
            avg();
            return;
        }
    }

    function drawIndex(){
        let drawnNumberI = Math.floor(Math.random() *7)+1;
        let drawnNumberJ = Math.floor(Math.random() *7)+1;
        fieldIndex = fieldsArray[drawnNumberI][drawnNumberJ].dataset.index;
        sideBar.innerHTML = fieldIndex;
    }

    function clearFieldColors(...elements){
        console.log(elements);
        elements.forEach((element)=> {
            element.classList.remove('success', 'fail');
        });
    }



    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: [],
            datasets: [{
                label: 'Wynik w poszczególnych próbach: ',
                backgroundColor: 'white',
                borderColor: 'black',
                data: [],
                fontSize: 30
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 25
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        fontSize: 20,
                        suggestedMin: 1,
                        suggestedMax: 50,
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                        fontSize: 20,
                    }
                }]
            }
        }
    });

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function avg(){
    let sum = 0;
    chart.data.datasets[0].data.forEach((element)=>{
        sum+= element;
    });
    
    average = sum/chart.data.datasets[0].data.length;
    console.log(average);
    averageSection.innerHTML = `Twój średni wynik to: ${average.toFixed(2)}`;

}

console.log(chart.data.datasets[0].data);

});


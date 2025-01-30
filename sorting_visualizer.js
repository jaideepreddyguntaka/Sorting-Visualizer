document.addEventListener("DOMContentLoaded", function () {

  const visualization = document.getElementById("visualization");
  const generatearraybtn = document.getElementById("generate-array");
  const startsortingbtn = document.getElementById("start-sorting");
  const algoselect = document.getElementById("algorithm");
  const speedselect = document.getElementById("speed");
  let array = [];
  let animationInterval;

  generatearraybtn.addEventListener("click", generateArray);
  startsortingbtn.addEventListener("click", async function () {
  await startSorting();
  });

  function setbtns(disable, ...buttons) 
  {
    for (const button of buttons) 
    {
      button.disabled = disable;
    }
  }

  function generateArray() {
    array = [];
    let size = Math.floor(Math.random()*40+1);
    if (size < 7) {
      size = 7;
    }
    for (let i = 0; i < size; i++) 
    {
      array.push(Math.floor(Math.random() * 100) + 1);
    }
    drawArray(array);
  }

  function resetColors() 
  {
    const bars = document.querySelectorAll(".bar");
    bars.forEach((bar) => {
    bar.style.backgroundColor = "#1fbac9"; // Setting the final color for all bars
    });
  }

  function drawArray(array, sortingRange = [], done = true) 
  {
    visualization.innerHTML = "";
    for (let i = 0; i < array.length; i++) 
    {
      const bar = document.createElement("div");
      bar.className = "bar";
      if (array[i]<=2) 
      {
        bar.style.height = array[i]*1.5 + "%";
        bar.style.fontSize='1.5vh';
        bar.style.overflow="hidden";
      } 
      else 
      {
        bar.style.height = array[i] + "%";
      }
      bar.style.width = "2vw";
      bar.style.margin = "0.07vh";
      bar.textContent = array[i];
      let color;
      if (sortingRange.includes(i)) 
      {
        color = "red"; // color for elements being swapped
      } 
      else if (i < sortingRange[0]) 
      {
        color = "green"; // color for elements already sorted
      } 
      else 
      {
        color = "#1fbac9"; // color for elements being swapped
      }
      bar.style.backgroundColor = color;
      visualization.appendChild(bar);
    }
  }

  async function startSorting() {
    setbtns(true, generatearraybtn, algoselect, speedselect);

    const selectalgo = algoselect.value;
    const speed = getspeed();
    const swaps = [];
    if (selectalgo === "Bubble Sort") 
    {
      await bubbleSort(array, speed, swaps);
    } 
    else if (selectalgo === "Selection Sort") 
    {
      await selectionSort(array, speed, swaps);
    } 
    else if (selectalgo === "Insertion Sort") 
    {
      await insertionSort(array, speed, swaps);
    } 
    else if (selectalgo === "Merge Sort")
    {
      await mergeSort(array, speed);
    } 
    else if (selectalgo === "Quick Sort") 
    {
      await mergeSort(array, speed);
    }
    resetColors();
    setbtns(false, generatearraybtn, algoselect, speedselect);
  }

  function getspeed() 
  {
    const speed = speedselect.value;
    if (speed === "Slow") 
    {
      return 1000; // slow
    } 
    else if (speed === "Medium") 
    { 
      return 500; // medium
    } 
    else if (speed === "Fast") 
    {
      return 250; // speed
    }
  }


  // Sorting algorithms

  async function bubbleSort(arr, speed) {
    let n = arr.length;
    let i = 0;
    let sortingInprogress = true;
    return new Promise((resolve) => {
      let animationInterval = setInterval(() => {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapped = true;
          }
        }
        drawArray(arr, [n - i - 1]);
        if (!swapped || !sortingInprogress) {
          clearInterval(animationInterval);
          sortingInprogress = false;
          resolve();
        }
        i++;
      }, speed);
    })
  }

  async function selectionSort(arr, speed) {
    let n = arr.length;
    let i = 0;
    let sortingInprogress = true;
    return new Promise((resolve) => {
      animationInterval = setInterval(() => {
        if (i >= n - 1) {
          // Sorting is complete
          clearInterval(animationInterval);
          sortingInprogress = false;
          resolve();
          return;
        }

        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
          if (arr[j] < arr[minIndex]) {
            minIndex = j;
          }
        }

        if (minIndex !== i) {
          [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
          drawArray(arr, [i, minIndex]);
        }

        i++;
      }, speed);
    })
  }

  async function insertionSort(arr, speed) {
    let n = arr.length;
    let i = 1;
    let sortingInprogress = true;

    return new Promise((resolve) => {
      animationInterval = setInterval(() => {
        if (i >= n) {
          // Sorting is complete
          clearInterval(animationInterval);
          sortingInprogress = false;
          resolve();
          return;
        }

        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;

        drawArray(arr, [i]);

        i++;
      }, speed);
    })
  }

  async function mergeSort(arr, speed) {
    async function merge(arr, left, middle, right) {
      const leftArr = arr.slice(left, middle + 1);
      const rightArr = arr.slice(middle + 1, right + 1);

      let i = 0,
        j = 0,
        k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        k++;

        drawArray(arr, [left, right]);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
        drawArray(arr, [left, right]);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
        drawArray(arr, [left, right]);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    }

    async function mergeSortHelper(arr, left, right) {
      if (left >= right) return;

      const middle = left + Math.floor((right - left) / 2);
      await mergeSortHelper(arr, left, middle);
      await mergeSortHelper(arr, middle + 1, right);
      await merge(arr, left, middle, right);
    }

    sortingInprogress = true;
    await mergeSortHelper(arr, 0, arr.length - 1);
    sortingInprogress = false;
    resetColors();
  }

  async function quickSort(arr, speed) {
    async function partition(arr, low, high) {
      let pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          drawArray(arr, [i, j]); // Update visualization
          await new Promise((resolve) => setTimeout(resolve, speed));
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      drawArray(arr, [i + 1, high]); // Update visualization
      await new Promise((resolve) => setTimeout(resolve, speed));

      return i + 1;
    }

    async function quickSortHelper(arr, low, high) {
      if (low < high) {
        let pi = await partition(arr, low, high);
        await quickSortHelper(arr, low, pi - 1);
        await quickSortHelper(arr, pi + 1, high);
      }
    }

    sortingInprogress = true;
    await quickSortHelper(arr, 0, arr.length - 1);
    sortingInprogress = false;
    resetColors();
  }
  generateArray();
});

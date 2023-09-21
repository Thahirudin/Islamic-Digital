// URL API Firebase
var apiUrl = "https://al-quran-8d642.firebaseio.com/data.json?print=pretty";
var data; // Variabel untuk menyimpan data surat

// Mengambil data dari API Firebase menggunakan AJAX
$.ajax({
  url: apiUrl,
  method: "GET",
  dataType: "json",
  success: function (responseData) {
    data = responseData; // Simpan data surat ke variabel data

    // Tampilkan semua surat saat halaman pertama dimuat
    tampilkanSemuaSurat();
  },
  error: function (error) {
    console.error("Error:", error);
  },
});
function tampilkanSemuaSurat() {
  $.each(data, function (index, surat) {
    var suratItem =
      "<div class= 'list-surat' data-aos='fade-up' data-aos-delay='300' data-aos-duration='3000' onclick='myFunction(" +
      surat.nomor +
      ")'>" +
      "<h3>" +
      surat.asma +
      "</h3>" +
      "<p>surat ke: " +
      surat.nomor +
      "</p><p>Jumlah Ayat:" +
      surat.ayat +
      "</p>" +
      "<p>Turun di:" +
      surat.type +
      "</p>" +
      "</div>";

    $("#surat-list").append(suratItem);
  });
}
const modal = document.getElementById("myModal");
const closeModal = document.querySelector(".close");
function myFunction(angka) {
  // Mengosongkan konten elemen #ayat-list sebelum menambahkan ayat-ayat yang baru
  $("#ayat-list").empty();

  modal.style.display = "block";
  var ayatApi =
    " https://al-quran-8d642.firebaseio.com/surat/" +
    angka +
    ".json?print=pretty";
  var suratTerpilih = data.find(function (surat) {
    return surat.nomor == angka;
  });
  if (suratTerpilih) {
    var audioItem =
      "<audio controls><source src='" +
      suratTerpilih.audio +
      "'></source></audio>";
    var namasurat = "<h1>Surat " + suratTerpilih.nama + "</h1>";
    $("#audio").append(audioItem);
    $("#nama-surat").append(namasurat);
    $("#surat-list").empty();
    tampilkanSemuaSurat();
  }
  $.ajax({
    url: ayatApi,
    method: "GET",
    dataType: "json",
    success: function (data) {
      // Loop melalui data dan menambahkannya ke daftar surat
      $.each(data, function (index, ayat) {
        var ayatItem =
          "<div class= 'list-ayat'>" +
          "<h2>" +
          " " +
          ayat.ar +
          "</h2><p>" +
          ayat.nomor +
          "</p><p>" +
          ayat.id +
          "</p></div>";

        $("#ayat-list").append(ayatItem);
      });
    },
    error: function (error) {
      console.error("Error:", error);
    },
  });
}
// Handle click event pada tombol pencarian
$("#cari-surat").click(function () {
  // Mendapatkan nilai yang dimasukkan oleh pengguna
  var nomorCari = $("input").val();

  // Mencari surat dengan nomor yang sesuai
  var suratTerpilih = data.find(function (surat) {
    return surat.nomor == nomorCari;
  });

  if (suratTerpilih) {
    Swal.fire("Sukses", "Surat Telah Ditemukan", "success");
    // Mengosongkan daftar surat sebelum menambahkan surat hasil pencarian
    $("#surat-list").empty();

    // Menambahkan surat hasil pencarian ke daftar surat
    var suratItem =
      "<div class= 'list-surat' data-aos='fade-up' data-aos-delay='300' data-aos-duration='3000'onclick='myFunction(" +
      suratTerpilih.nomor +
      ")'>" +
      "<h2>" +
      suratTerpilih.asma +
      "</h2>" +
      "surat ke: " +
      suratTerpilih.nomor +
      "<p>Jumlah Ayat:" +
      suratTerpilih.ayat +
      "</p>" +
      "<p>Turun di:" +
      suratTerpilih.type +
      "</p>" +
      "</div>";

    $("#surat-list").append(suratItem);
  } else {
    Swal.fire(
      "Maaf Tidak Ditemukan",
      "sayang sekali yang anda inginkan tidak kami ketahui, coba sekali lagi yah",
      "error"
    );
    $("#surat-list").empty();
    tampilkanSemuaSurat();
  }
});
$("#search").on("input", function () {
  var nama = $(this).val();
  if (nama === "") {
    $("#surat-list").empty();
    tampilkanSemuaSurat();
  }
});
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  $("#audio").empty();
  $("#nama-surat").empty();
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    $("#audio").empty();
    $("#nama-surat").empty();
  }
});

function showalquran() {
  var surat = document.getElementById("surat-alquran");
  var jadwal = document.getElementById("jadwal-sholat");
  surat.style.display = "block"; // Mengatur tampilan surat-alquran menjadi 'block'
  jadwal.style.display = "none"; // Mengatur tampilan jadwal-sholat menjadi 'none'
}
function showjadwal() {
  var surat = document.getElementById("surat-alquran");
  var jadwal = document.getElementById("jadwal-sholat");
  surat.style.display = "none"; // Mengatur tampilan surat-alquran menjadi 'block'
  jadwal.style.display = "block"; // Mengatur tampilan jadwal-sholat menjadi 'none'
}
const cityInput = $("#cityInput");
const citiesDatalist = $("#cities");
const searchButton = $("#search-button");
const resultContainer = $("#prayerTimes");

// Fungsi untuk mengisi datalist dengan opsi kota dari API
function fillCitiesDatalist() {
  const url = "https://api.banghasan.com/sholat/format/json/kota";

  $.ajax({
    url: url,
    method: "GET",
    success: function (response) {
      const cities = response.kota || [];

      citiesDatalist.html(""); // Menghapus opsi sebelumnya

      cities.forEach(function (city) {
        const option = $("<option>")
          .attr("value", city.nama)
          .attr("data-id", city.id);
        citiesDatalist.append(option);
      });
    },
    error: function () {
      console.error("Terjadi kesalahan saat mengambil data kota.");
    },
  });
}

// Panggil fungsi untuk mengisi datalist saat halaman dimuat
fillCitiesDatalist();

// Fungsi untuk mengambil jadwal sholat berdasarkan ID kota dan tanggal tertentu
function getPrayerTimes(cityId, date, cityName) {
  const url = `https://api.banghasan.com/sholat/format/json/jadwal/kota/${cityId}/tanggal/${date}`;

  $.ajax({
    url: url,
    method: "GET",
    success: function (response) {
      const jadwal = response.jadwal || {};
      const tgl = jadwal.data.tanggal || "";
      var city = "<h2>Jadwal Sholat " + cityName + "</h2>";
      $("#title-jadwal").append(city);
      const jadwalSholat = jadwal.data || {};
      resultContainer.html(`
      <div class= 'list-jadwal' data-aos='fade-up' data-aos-delay='300' data-aos-duration='3000'>
        <h3>Jadwal Shubuh</h3>
        <p>${jadwalSholat.subuh}</p>
      </div>
      <div class= 'list-jadwal' data-aos='fade-up' data-aos-delay='300' data-aos-duration='3000'>
        <h3>Jadwal Dzuhur</h3>
        <p>${jadwalSholat.dzuhur}</p>
      </div>
      <div class= 'list-jadwal' data-aos='fade-up' data-aos-delay='300' data-aos-duration='3000'>
        <h3>Jadwal Ashar</h3>
        <p>${jadwalSholat.ashar}</p>
      </div>
      <div class= 'list-jadwal' data-aos='fade-up' data-aos-delay='300' data-aos-duration='3000'>
        <h3>Jadwal Maghrib</h3>
        <p>${jadwalSholat.maghrib}</p>
      </div>
      <div class= 'list-jadwal' data-aos='fade-up' data-aos-delay='300' data-aos-duration='3000'>
        <h3>Jadwal Isya</h3>
        <p>${jadwalSholat.isya}</p>
      </div>`);
    },
    error: function () {
      console.error("Terjadi kesalahan saat mengambil jadwal sholat.");
    },
  });
}
searchButton.click(function () {
  const cityName = cityInput.val();
  $("#title-jadwal").empty();
  $("#sholat-content").empty();
  const selectedOption = citiesDatalist.find(`option[value="${cityName}"]`);
  if (!selectedOption.length) {
    Swal.fire("Gagal", "Kota yang kamu masukkan tidak ditemukan", "error");
    return;
  }

  const cityId = selectedOption.data("id");
  // Mendapatkan tanggal saat ini dalam format "YYYY-MM-DD"
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  getPrayerTimes(cityId, formattedDate, cityName);
  Swal.fire("Sukses", "Kota Telah Berhasil Ditemukan ", "success");
});
// Fungsi untuk menampilkan jadwal sholat Kota Pekanbaru secara default
function showDefaultPrayerTimes() {
  const defaultCityId = 597; // ID Kota Pekanbaru
  const defaultCityName = "Kota Pekanbaru"; // Nama Kota Pekanbaru
  // Mendapatkan tanggal saat ini dalam format "YYYY-MM-DD"
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  // Menampilkan nama kota di dalam elemen dengan ID "city-name"
  getPrayerTimes(defaultCityId, formattedDate, defaultCityName);
}

// Panggil fungsi untuk menampilkan jadwal sholat Kota Pekanbaru secara default saat halaman dimuat
$(document).ready(function () {
  showDefaultPrayerTimes();
});

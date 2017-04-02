const records = [
  'https://img.discogs.com/esnpjUuNUm0ZC6Vt5lZJ-I4dW9w=/fit-in/500x500/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1753053-1243981022.jpeg.jpg',
  'https://img.discogs.com/vtaFuo4LrHAUbwUblUaVFZh9Da0=/fit-in/596x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-3842693-1346574571-9805.jpeg.jpg',
  'https://img.discogs.com/n6npBN1pU2z7xe6auTnlsU5e-KM=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-9296607-1479032194-2661.jpeg.jpg',
  'https://img.discogs.com/9P91uKyIVdShmT3P6-Bgkqx4BF4=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-7374815-1440665089-6960.jpeg.jpg',
  'https://img.discogs.com/JwM4_VrtQEdlEoP2fNpo1eorVkI=/fit-in/600x589/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1815961-1322077557.jpeg.jpg',
  'https://img.discogs.com/vHOkFygn0OTZRVakq7nkCBWWW9Y=/fit-in/599x595/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-649306-1391254571-9166.jpeg.jpg',
  'https://img.discogs.com/cYBaa8EC6g5TUQ5JbkBtt56JkPo=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-2496819-1290364174.jpeg.jpg',
  'https://img.discogs.com/nYEYVK_WnqBpf-NUOvHc4MceKfQ=/fit-in/480x480/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-7577132-1444405711-8181.jpeg.jpg',
  'https://img.discogs.com/7O6yIBv2gMx_IoK_7I0ooFFCU3k=/fit-in/600x598/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1097885-1425019145-2733.jpeg.jpg',
  'https://img.discogs.com/5niM71_Gc3Zkk6VK4cRlpHpQRIY=/fit-in/600x590/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-499497-1456047383-9489.jpeg.jpg',
  'https://img.discogs.com/7O6yIBv2gMx_IoK_7I0ooFFCU3k=/fit-in/600x598/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1097885-1425019145-2733.jpeg.jpg',
  'https://img.discogs.com/5niM71_Gc3Zkk6VK4cRlpHpQRIY=/fit-in/600x590/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-499497-1456047383-9489.jpeg.jpg',
];

export function getRecords() {
  return Promise.resolve(records.concat(records));
}

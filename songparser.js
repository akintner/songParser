const fs = require('fs');

// Read the JSON files
fs.readFile('top100.json', 'utf8', (err1, data1) => {
    if (err1) {
        console.error('Error reading the first file:', err1);
        return;
    } try {
        // Parse the JSON data
        const newdata = JSON.parse(data1);
        const data = newdata["data"]
        const included = newdata["included"]

        // Create lookup tables for included data
        const albums = {};
        const artists = {};
        const genres = {};
        const writers = {};

        included.forEach(item => {
            if (item.type === 'Album') {
                albums[item.id] = {
                    id: item.id,
                    name: item.attributes.name
                };
            } else if (item.type === 'Artist') {
                artists[item.id] = {
                    id: item.id,
                    name: item.attributes.name
                };
            } else if (item.type === 'Writer') {
                writers[item.id] = {
                    id: item.id,
                    name: item.attributes.name
                };
            } else if (item.type === 'Genre') {
                genres[item.id] = {
                    id: item.id,
                    name: item.attributes.name
                };
            }
        });

        // Restructure the data
        const restructuredData = data.map(item => ({
            title: item.attributes.title,
            released: item.attributes.released,
            album: albums[item.relationships.album.data.id],
            artists: item.relationships.artists.data.map(artist => artists[artist.id]),
            featured_artists: item.relationships.featured_artists.data.map(artist => artists[artist.id]),
            writers: item.relationships.writers.data.map(writer => writers[writer.id]),
            genres: item.relationships.genres.data.map(genre => genres[genre.id])
        }));

        // Write the restructured data to a new JSON file
        fs.writeFile('newSongData.json', JSON.stringify(restructuredData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing the file:', err);
                return;
            }
            console.log('Restructured data has been saved to newSongData.json');
        });
    } catch (err) {
        console.error('Error parsing JSON data:', err);
    }
});

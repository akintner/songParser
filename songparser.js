const fs = require('fs');

// Read the JSON files
fs.readFile('top100.json', 'utf8', (err, data1) => {
    if (err) {
        console.error('Error reading the file:', err);
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
        const restructuredData = data.map(song => ({
            title: song.attributes.title,
            released: song.attributes.released,
            album: albums[song.relationships.album.data.id],
            artists: song.relationships.artists.data.map(artist => artists[artist.id]),
            featured_artists: song.relationships.featured_artists.data.map(artist => artists[artist.id]),
            writers: song.relationships.writers.data.map(writer => writers[writer.id]),
            genres: song.relationships.genres.data.map(genre => genres[genre.id])
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

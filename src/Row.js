import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";
import movieTrailer from "movie-trailer";

const baseurl = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchURL, isLargeRow }) {
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState("");

	useEffect(() => {
		async function fetchData() {
			const request = await axios.get(fetchURL);
			setMovies(request.data.results);
			return request;
		}

		fetchData();
	}, [fetchURL]);

	const opts = {
		height: "390",
		width: "100%",
		playerVars: {
			autoPlay: 1,
		},
	};

	const handleClick = (it) => {
		if (trailerUrl) {
			setTrailerUrl("");
		} else {
			movieTrailer(null, { tmdbId: it.id })
				.then((url) => {
					console.log("url is " + url);
					const urlParams = new URLSearchParams(new URL(url).search);
					console.log("urlParamsn" + urlParams);
					setTrailerUrl(urlParams.get("v"));
				})
				.catch((error) => console.log(error));
		}
	};

	console.table(movies);

	return (
		<div className="row">
			<h2>{title}</h2>

			<div className="row_posters">
				{movies?.map((it) => (
					<img
						key={it.id}
						onClick={() => handleClick(it)}
						className={`row_poster ${isLargeRow && "row_posterLarge"}`}
						src={`${baseurl}${isLargeRow ? it.poster_path : it.backdrop_path}`}
						alt={it.name}
					/>
				))}
			</div>
			{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
		</div>
	);
}

export default Row;

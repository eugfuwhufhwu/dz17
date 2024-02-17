const list = document.querySelector('.products')
const getBtn = document.querySelector('.get')
const postBtn = document.querySelector('.post')
const patchBtn = document.querySelector('.patch')
const deleteBtn = document.querySelector('.delete')

const getData = url => {
	return new Promise((resolve, reject) =>
		fetch(url)
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
}
const postData = (url, product) => {
	return new Promise((resolve, reject) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(product),
			headers: { 'Content-type': 'application/json; charset=UTF-8' }
		})
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
}

const patchData = (url, product) => {
	return new Promise((resolve, reject) =>
		fetch(url, {
			method: 'PATCH',
			body: JSON.stringify(product),
			headers: { 'Content-type': 'application/json; charset=UTF-8' }
		})
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
}

const delData = url => {
	return new Promise((resolve, reject) =>
		fetch(url, { method: 'DELETE' })
			.then(response => response.json())
			.then(json => resolve(json))
			.catch(error => reject(error))
	)
}

// отобразить все продукты
getBtn.addEventListener('click', async e => {
	e.preventDefault()
	try {
		const products = await getData('http://localhost:3000/PRODUCTS')
		products.forEach(product => {
			list.insertAdjacentHTML(
				`beforeend`,
				`
			<li class="productItem">
					<div class="block-color" style="background: ${product.color}"></div>
					<div class="text-info">
						<p class="title">${product.title}</p>
						<p class="price">${product.price} руб.</p>
						<p class="ingridients">${product.ingridients.join(', ')}</p>
					</div>
					<div class="likes">${product.likes}</p>
					<div class="dislikes">${product.dislikes}</p>
				</li>
			`
			)
		})
	} catch (error) {
		console.log(error)
	}
})

const lks = document.querySelector(".likes")

// добавить новый продукт
postBtn.addEventListener('click', async e => {
	e.preventDefault()
	let title = prompt('введите название')
	let price = +prompt('введите цену')
	let ingridients = prompt('введите ингридиенты через запятую').split(', ')
	let color = prompt('введите цвет')
	try {
		await postData('http://localhost:3000/PRODUCTS', {
			id: title.trim(''),
			title,
			price,
			ingridients,
			color
		}).then(response => {
			console.log(response, 'данные успешно добавлены')
		})
	} catch (error) {
		console.error(error)
	}
})

// изменить продукт
patchBtn.addEventListener('click', async e => {
	e.preventDefault()
	let id = prompt('введите id')
	let title = prompt('введите название')
	let price = +prompt('введите цену')
	let ingridients = prompt('введите ингридиенты через запятую').split(', ')
	let color = prompt('введите цвет')
	try {
		await patchData(`http://localhost:3000/PRODUCTS/${id}`, {
			title,
			price,
			ingridients,
			color
		}).then(response => {
			console.log(response, 'данные успешно обновлены')
		})
	} catch (error) {
		console.error(error, 'не получилось обновить данные')
	}
})

// удалить продукт
deleteBtn.addEventListener('click', async e => {
	e.preventDefault()
	const id = prompt('введите id')
	try {
		delData(`http://localhost:3000/PRODUCTS/${id}`).then(response => {
			console.log(response, `продукт с id = ${id} успешно удалён`)
		})
	} catch (err) {
		console.error(err, 'ошибка при удалении')
	}
})

const likeProduct = async (productId) => {
    try {
        const product = await getData(`http://localhost:3000/PRODUCTS/${productId}`)
        product.likes++
        await patchData(`http://localhost:3000/PRODUCTS/${productId}, product`)
        // обновить отображение продукта
    } catch (error) {
        console.log(error)
    }
}

const dislikeProduct = async (productId) => {
    try {
        const product = await getData(`http://localhost:3000/PRODUCTS/${productId}`)
        product.dislikes++
        await patchData(`http://localhost:3000/PRODUCTS/${productId}, product`)
        // обновить отображение продукта
    } catch (error) {
        console.log(error)
    }
}

lks.addEventListener('click', async e => {
    if (e.target.classList.contains('likes')) {
        const productId = e.target.closest('.productItem').dataset.productId
        likeProduct(productId)
    }
    if (e.target.classList.contains('dislikes')) {
        const productId = e.target.closest('.productItem').dataset.productId
        dislikeProduct(productId)
    }
})
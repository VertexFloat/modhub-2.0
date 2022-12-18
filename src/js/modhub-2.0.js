// Copyright (C) 4c65736975. All rights reserved.

const filters = ['Top', 'Active', 'State', 'Game']
const filtersChilds = {'Top': null, 'Active': null, 'State': ['New', 'Live', 'Pending', 'Review', 'Testing'], 'Game': ['FS19', 'FS22']}
const dataRoot = document.getElementsByClassName('box-space')[0]

let lastFilterChildTarget
let activeFilters = {}
let filteredSearchResult = []
let dataRootLogin

if (document.getElementsByClassName('box-space')[0]) {
    dataRootLogin = document.getElementsByClassName('box-space')[0].children[1]
}

const init = () => {
    const pathName = window.location.pathname

    if (pathName.includes('mods.php')) {
        getLoadedData('mods')
    }

    if (pathName.includes('mod.php')) {
        getLoadedData('mod')
    }

    if (pathName.includes('modHubBEMain.php')) {
        if (dataRootLogin.children[0].classList.contains('medium-8')) {
            getLoadedData('login')
        } else {
            getLoadedData('modhubAccountMods')
        }
    }

    if (pathName.includes('modHubBEMod.php')) {
        getLoadedData('modhubAccountMod')
    }

    if (pathName.includes('modHubBERewards.php')) {
        getLoadedData('modhubAccountRewards')
    }

    if (pathName.includes('modHubBEAwards.php')) {
        getLoadedData('modhubAccountAwards')
    }

    if (pathName.includes('modHubBEMessenger.php')) {
        getLoadedData('modhubAccountMessanger')
    }

    if (pathName.includes('modHubBEMisc.php')) {
        getLoadedData('modhubAccountMisc')
    }
}

const getLoadedData = async (content) => {
    const data = {}

    switch (content) {
        case 'mods':
            await loadFeaturedData(data)
            .catch((error) => {
                console.log(error)
            })
            await loadUserNavbarData(data)
            .catch((error) => {
                console.log(error)
            })
            await loadFeaturedModsData(data)
            .catch((error) => {
                console.log(error)
            })
            await loadModsListData(data)
            .catch((error) => {
                console.log(error)
            })
            await loadPaginationData(data)
            .catch((error) => {
                console.log(error)
            })
            await loadFooterData(data)
            .catch((error) => {
                console.log(error)
            })

            createModsPageInterface(data)

            dataRoot.remove()

            break

        case 'mod':
            await loadUserNavbarData(data)
            .catch((error) => {
                console.log(error)
            })
            await loadModData(data)
            .catch((error) => {
                console.log(error)
            })
            await loadFooterData(data)
            .catch((error) => {
                console.log(error)
            })

            createModPageInterface(data)

            dataRoot.remove()

            break

        case 'login':
            await loadLoginFormData(data)
            .catch((error) => {
                console.log(error)
            })

            createLoginPageInterface(data)

            dataRootLogin.remove()

            break

        case 'modhubAccountMods':
            const target = document.getElementById('modsList')

            await loadUserModsNavbarData(data)
            .catch((error) => {
                console.log(error)
            })

            new Promise((resolve, reject) => {
                const mutationHandler = async (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === 'childList') {
                            await loadModsData(data)
                            .catch((error) => {
                                console.log(error)
                            })

                            resolve()
                        }
                    }

                    observer.disconnect()
                }

                const observer = new MutationObserver(mutationHandler)

                observer.observe(target, {childList: true, subtree: true})
            })
            .then(() => {
                createModhubAccountModsPageInterface(data)

                setActiveModsFilters(null, null, true, false)

                dataRoot.children[1].remove()
                document.getElementById('modsList').remove()
            })

            break

        case 'modhubAccountMod':
            await loadUserModsNavbarData(data)
            .catch((error) => {
                console.log(error)
            })

            createModhubAccountRewardsPageInterface(data)

            break

        case 'modhubAccountRewards':
            await loadUserModsNavbarData(data)
            .catch((error) => {
                console.log(error)
            })

            createModhubAccountRewardsPageInterface(data)

            break

        case 'modhubAccountAwards':
            await loadUserModsNavbarData(data)
            .catch((error) => {
                console.log(error)
            })

            createModhubAccountRewardsPageInterface(data)

            break

        case 'modhubAccountMessanger':
            await loadUserModsNavbarData(data)
            .catch((error) => {
                console.log(error)
            })

            createModhubAccountRewardsPageInterface(data)

            break

        case 'modhubAccountMisc':
            await loadUserModsNavbarData(data)
            .catch((error) => {
                console.log(error)
            })

            createModhubAccountRewardsPageInterface(data)

            break

        default:
            break
    }
}

const loadFeaturedData = (data) => {
    return new Promise((resolve, reject) => {
        const featuredContainer = document.getElementsByClassName('dlc-featured')[0]

        if (featuredContainer) {
            data['featured'] = {}
            data['featured'].imageUrl = featuredContainer.style['background-image']

            const infoContainer = getChildrenElementByTagAndClass(featuredContainer, 'div', 'dlc-featured__info')

            if (infoContainer) {
                data['featured'].info = {}

                const preheaderText = getChildrenElementByTagAndClass(infoContainer, 'div', 'preheader')

                data['featured'].info['preheader'] = preheaderText.textContent

                const modName = getChildrenElementByTagAndClass(infoContainer, 'h3', 'color-white')

                data['featured'].info['modName'] = modName.textContent

                const modInfo = infoContainer.children[2].textContent

                data['featured'].info['modInfo'] = modInfo

                const modRating = getChildrenElementByTagAndClass(infoContainer, 'div', 'mods-main-rating')

                if (modRating) {
                    const modRatingStars = [...modRating.children]

                    let stars = 0

                    modRatingStars.forEach((star) => {
                        if (!star.classList.contains('half') && !star.classList.contains('grey')) {
                            stars = stars + 1
                        } else if (!star.classList.contains('grey')) {
                            stars = stars + 0.5
                        }
                    })

                    data['featured'].info['rating'] = stars
                }

                data['featured'].info['button'] = {}

                const moreInfoText = getChildrenElementByTagAndClass(infoContainer, 'a', 'button')

                data['featured'].info['button'].text = moreInfoText.textContent
                data['featured'].info['button'].href = moreInfoText.href

                const searchInput = getChildrenElementByTagAndClass(infoContainer, 'div', 'mod-search-box')

                if (searchInput) {
                    data['searchInput'] = {}

                    const searchForm = [...searchInput.children][0]

                    data['searchInput'].action = searchForm.action
                    data['searchInput'].name1 = searchForm.children[0].name
                    data['searchInput'].inputValue = searchForm.children[0].value
                    data['searchInput'].name2 = searchForm.children[1].name
                    data['searchInput'].placeholder = searchForm.children[1].placeholder
                }
            }

            resolve()
        }

        reject('No data found !')
    })
}

const loadUserNavbarData = (data) => {
    return new Promise((resolve, reject) => {
        const userNavbarContainer = document.getElementsByClassName('features-tabs')[0]

        if (userNavbarContainer) {
            data['userNavbar'] = {}

            const userNavbarFixContainer = userNavbarContainer.children[0]
            const userNavbarTabsContainer = userNavbarFixContainer.children[1]
            const userNavbarTabs = [...userNavbarTabsContainer.children]

            for (let i = 0; i < userNavbarTabs.length; i++) {
                const userNavbarTab = userNavbarTabs[i]

                if (!userNavbarTab.classList.contains('is-parent')) {
                    const navbarContent = userNavbarTab.children[0]

                    data['userNavbar'][navbarContent.innerHTML] = {}

                    data['userNavbar'][navbarContent.innerHTML].href = navbarContent.href

                    if (userNavbarTab.classList.contains('is-active')) {
                        data['userNavbar'][navbarContent.innerHTML].active = true
                    }

                    data['userNavbar'][navbarContent.innerHTML].id = i
                } else {
                    const navbarContentText = userNavbarTab.children[0]

                    data['userNavbar'][navbarContentText.textContent] = {}

                    const navbarContent = [...userNavbarTab.children[1].children]

                    for (let i = 0; i < navbarContent.length; i++) {
                        const content = navbarContent[i].children[0]

                        data['userNavbar'][navbarContentText.textContent][content.textContent] = content.href
                    }
                }
            }

            const userNavbarLoginBtn = userNavbarFixContainer.children[2]

            data['userNavbar'].button = {}
            data['userNavbar'].button.href = userNavbarLoginBtn.href
            data['userNavbar'].button.text = userNavbarLoginBtn.innerHTML

            resolve()
        }

        reject('No data found !')
    })
}

const loadModData = (data) => {
    return new Promise((resolve, reject) => {
        data['mod'] = {}

        let incrementCheck = 0
        let temp = []

        for (let i = 0; i < dataRoot.children.length; i++) {
            const children = dataRoot.children[i]

            if (children.nodeName == 'BR') {
                incrementCheck = incrementCheck + 1
            }

            if (incrementCheck === 1 && children.nodeName !== 'BR') {
                temp.push(children.cloneNode(true))
            }

            if (incrementCheck === 2) {
                break;
            }
        }

        data['mod'].modContent = temp

        resolve()
    })
}

const loadFeaturedModsData = (data) => {
    return new Promise((resolve, reject) => {
        const featuredModsRow = getChildrenElementByTagAndClass(dataRoot, 'div', 'medium-up-1')

        if (featuredModsRow) {
            const featuredModsRow = [...getChildrenElementByTagAndClass(dataRoot, 'div', 'medium-up-1').children]

            data['featuredMods'] = {}

            featuredModsRow.forEach((column, index) => {
                data['featuredMods'][index] = {}

                const columnData = column.children[0]

                const dlcTitleContainer = getChildrenElementByTagAndClass(columnData, 'div', 'dlc__title')

                data['featuredMods'][index].featuredTitle = dlcTitleContainer.children[0].textContent
                data['featuredMods'][index].featuredPrice = dlcTitleContainer.children[1].innerHTML

                const modContent = getChildrenElementByTagAndClass(columnData, 'div', 'machines__content')

                const modImage = getChildrenElementByTagAndClass(modContent, 'div', 'machines__img')

                if (getChildrenElementByTagAndClass(modImage, 'div', 'mod-label')) {
                    data['featuredMods'][index].modLabel = getChildrenElementByTagAndClass(modImage, 'div', 'mod-label').innerHTML

                    data['featuredMods'][index].modHref = modImage.children[1].href
                    data['featuredMods'][index].modImage = modImage.children[1].children[0].src
                } else {
                    data['featuredMods'][index].modHref = modImage.children[0].href
                    data['featuredMods'][index].modImage = modImage.children[0].children[0].src
                }

                const modOverview = getChildrenElementByTagAndClass(modContent, 'div', 'machines__overview')

                data['featuredMods'][index].modName = modOverview.children[0].innerHTML
                data['featuredMods'][index].modInfo = modOverview.children[1].textContent

                const modRating = getChildrenElementByTagAndClass(modOverview, 'div', 'mods-rating')

                if (modRating) {
                    data['featuredMods'][index]['rating'] = {}

                    const modRatingStars = [...modRating.children]

                    let stars = 0

                    modRatingStars.forEach((star) => {
                        if (!star.classList.contains('half') && !star.classList.contains('grey')) {
                            stars = stars + 1
                        } else if (!star.classList.contains('grey')) {
                            stars = stars + 0.5
                        }
                    })

                    data['featuredMods'][index]['rating'].stars = stars
                    data['featuredMods'][index]['rating'].count = modOverview.childNodes[6].textContent
                }
            })

            resolve()
        }

        reject('No data found !')
    })
}

const loadModsListData = (data) => {
    return new Promise((resolve, reject) => {
        const modsItems = [...document.getElementsByClassName('mod-item')]

        data['modsItems'] = {}

        if (modsItems.length > 0) {
            modsItems.forEach((item, index) => {
                data['modsItems'][index] = {}

                const modImageContent = [...getChildrenElementByTagAndClass(item, 'div', 'mod-item__img').children]

                if (modImageContent[1]) {
                    const modImage = [...modImageContent[1].children]

                    data['modsItems'][index].modImage = modImage[0].src
                    data['modsItems'][index].modLabel = modImageContent[0].innerHTML
                } else {
                    const modImage = [...modImageContent[0].children]

                    data['modsItems'][index].modImage = modImage[0].src
                }

                const modTextContent = [...getChildrenElementByTagAndClass(item, 'div', 'mod-item__content').children]

                data['modsItems'][index].modName = modTextContent[0].innerHTML
                data['modsItems'][index].modAuthor = modTextContent[1].textContent

                const modRating = modTextContent[2]

                if (modRating) {
                    data['modsItems'][index]['rating'] = {}

                    const modRatingStars = [...modRating.children]

                    let stars = 0

                    modRatingStars.forEach((star) => {
                        if (!star.classList.contains('half') && !star.classList.contains('grey')) {
                            stars = stars + 1
                        } else if (!star.classList.contains('grey')) {
                            stars = stars + 0.5
                        }
                    })

                    data['modsItems'][index]['rating'].stars = stars
                    data['modsItems'][index]['rating'].count = modTextContent[3].innerHTML
                }

                data['modsItems'][index].modHref = [...item.children][2].href
            })

            resolve()
        }

        reject('No data found !')
    })
}

const loadPaginationData = (data) => {
    return new Promise((resolve, reject) => {
        const pagination = document.getElementsByClassName('pagination-wrap')[0]

        if (pagination) {
            data['pagination'] = {}

            const paginationPrevious = getChildrenElementByTagAndClass(pagination, 'div', 'pagination-previous')

            data['pagination'].previous = {}

            if (paginationPrevious.classList.contains('disabled')) {
                data['pagination'].previous['disabled'] = true
            } else {
                const paginationPreviousHref = [...paginationPrevious.children][0].href

                data['pagination'].previous['href'] = paginationPreviousHref
            }

            const paginationNext = getChildrenElementByTagAndClass(pagination, 'div', 'pagination-next')

            data['pagination'].next = {}

            if (paginationNext.classList.contains('disabled')) {
                data['pagination'].next['disabled'] = true
            } else {
                const paginationNextHref = [...paginationNext.children][0].href

                data['pagination'].next['href'] = paginationNextHref
            }

            const paginationPages = [...getChildrenElementByTagAndClass(pagination, 'ul', 'pagination').children]

            data['pagination'].pages = {}

            paginationPages.forEach((page, index) => {
                const pageNumber = page.children[0].textContent

                data['pagination'].pages[index] = {}

                if (page.classList.contains('current')) {
                    data['pagination'].pages[index].page = page.textContent.replace(/[^0-9]/g, '')
                    data['pagination'].pages[index].current = true
                } else {
                    data['pagination'].pages[index].page = pageNumber

                    if (pageNumber.match(/[0-9]/g)) {
                        data['pagination'].pages[index].href = page.children[0].href
                    }
                }
            })
        } else {
            reject('No data found !')
        }

        resolve()
    })
}

const loadFooterData = (data) => {
    return new Promise((resolve, reject) => {
        data['footerDesc'] = document.getElementsByClassName('mods-footer-desc')[0].innerHTML

        resolve()
    })
}

const loadLoginFormData = (data) => {
    return new Promise((resolve, reject) => {
        data['loginPage'] = {}

        const formRoot = getChildrenElementByTagAndClass(dataRootLogin, 'div', 'medium-8').children[2]

        data['loginPage'].method = formRoot.method
        data['loginPage'].action = formRoot.action
        data['loginPage'].emailText = getChildrenElementByTagAndClass(formRoot.children[1], 'div', 'medium-3').textContent.split('\n')[1].replace(/\s/g, '')
        data['loginPage'].passwordText = getChildrenElementByTagAndClass(formRoot.children[2], 'div', 'medium-3').textContent.split('\n')[1].replace(/\s/g, '')

        const buttonRoot = getChildrenElementByTagAndClass(formRoot.children[3], 'div', 'medium-9').children[0]

        data['loginPage'].loginButtonType = buttonRoot.type
        data['loginPage'].loginButtonValue = buttonRoot.value

        const optionsRoot = formRoot.children[4]

        data['loginPage'].passwordResetHref = optionsRoot.children[0].href
        data['loginPage'].passwordResetText = optionsRoot.children[0].textContent.split('» ')[1]
        data['loginPage'].newAccountHref = optionsRoot.children[2].href
        data['loginPage'].newAccountText = optionsRoot.children[2].textContent.split('» ')[1]

        resolve()
    })
}

const loadUserModsNavbarData = (data) => {
    return new Promise((resolve, reject) => {
        const navbarRoot = document.getElementsByClassName('features-tabs')[0].children[0]

        data['modsNavbar'] = {}

        const textTabsRoot = navbarRoot.children[0]
        const userNavbarTabs = [...textTabsRoot.children]

        for (let i = 0; i < userNavbarTabs.length; i++) {
            const userNavbarTab = userNavbarTabs[i]

            if (!userNavbarTab.classList.contains('is-parent')) {
                const navbarContent = userNavbarTab.children[0]

                data['modsNavbar'][navbarContent.innerHTML] = {}

                data['modsNavbar'][navbarContent.innerHTML].href = navbarContent.href

                if (userNavbarTab.classList.contains('is-active')) {
                    data['modsNavbar'][navbarContent.innerHTML].active = true
                }

                data['modsNavbar'][navbarContent.innerHTML].id = i
            } else {
                const navbarContentText = userNavbarTab.children[0]

                data['modsNavbar'][navbarContentText.textContent] = {}

                const navbarContent = [...userNavbarTab.children[1].children]

                for (let i = 0; i < navbarContent.length; i++) {
                    const content = navbarContent[i].children[0]

                    data['modsNavbar'][navbarContentText.textContent][content.textContent] = content.href
                }
            }
        }

        data['modsNavbar'].logoutHref = navbarRoot.children[1].href
        data['modsNavbar'].logoutText = navbarRoot.children[1].textContent

        resolve()
    })
}

const loadModsData = async (data) => {
    return new Promise((resolve, reject) => {
        const modslistRoot = document.getElementById('modsList').children[0]

        data['modsList'] = {}

        data['modsList'].formMethod = modslistRoot.method
        data['modsList'].formAction = modslistRoot.action

        const formRoot = modslistRoot
        const modsTableRoot = formRoot.children[0].children[0].children
        const tableArray = [...modsTableRoot]

        data['modsList'].tableHeader = {}
        data['modsList'].tableMods = {}

        const hierarchy = ['name', 'state', 'game', 'downloads', 'rating', 'active', 'top', 'update']

        for (let i = 0; i < tableArray.length; i++) {
            const tableHeader = [...tableArray[i].children]

            if (i === 0) {
                for (let j = 0; j < tableHeader.length - 1; j++) {
                    const header = tableHeader[j]

                    data['modsList'].tableHeader[header.textContent] = {}
                    data['modsList'].tableHeader[header.textContent].id = j

                    if (header.title) {
                        data['modsList'].tableHeader[header.textContent].title = header.title
                    }
                }
            } else {
                if (i + 1 == tableArray.length) {
                    data['modsList'].tableMods['summary'] = {}

                    data['modsList'].tableMods['summary'].mods = tableArray[i].children[0].children[0].textContent
                    data['modsList'].tableMods['summary'].downloads = tableArray[i].children[3].children[0].textContent
                    data['modsList'].tableMods['summary'].rating = tableArray[i].children[4].children[0].textContent
                    data['modsList'].tableMods['summary'].active = tableArray[i].children[5].children[0].textContent
                    data['modsList'].tableMods['summary'].top = tableArray[i].children[6].children[0].textContent
                } else {
                    data['modsList'].tableMods[i - 1] = {}

                    for (let j = 0; j < tableHeader.length; j++) {
                        const tableMod = tableHeader[j]

                        if (j === 0) {
                            data['modsList'].tableMods[i - 1].name = tableMod.children[0].textContent
                            data['modsList'].tableMods[i - 1].href = tableMod.children[0].href
                        }
                        if (j === 1) {
                            if (tableMod.children.length > 0) {
                                data['modsList'].tableMods[i - 1].state = tableMod.children[0].textContent
                            } else {
                                data['modsList'].tableMods[i - 1].state = tableMod.textContent
                            }
                        }

                        data['modsList'].tableMods[i - 1][hierarchy[j]] = tableMod.textContent
                    }
                }

                if (tableArray[i].title) {
                    data['modsList'].tableMods[i - 1].title = tableArray[i].title
                }
            }
        }

        data['modsList'].formBtnType = formRoot.children[1].type
        data['modsList'].formBtnName = formRoot.children[1].name
        data['modsList'].formBtnValue = formRoot.children[1].value

        resolve()
    })
}

const createModsPageInterface = (data) => {
    const uiRoot = document.getElementsByTagName('header')[0]

    if (uiRoot) {
        const baseContainer = document.createElement('div')

        baseContainer.classList = 'modhub-2-0-base-content-container'

        baseContainer.appendChild(createFeaturedContainer(data))
        baseContainer.appendChild(createUserNavbarContainer(data))
        baseContainer.appendChild(createModsItemsContainer(data))
        baseContainer.appendChild(createPaginationContainer(data))
        baseContainer.appendChild(createFooterDescContainer(data.footerDesc))

        return [uiRoot.parentNode.insertBefore(baseContainer, uiRoot.nextSibling), initFeaturedImagesAnimation()]
    }
}

const createModPageInterface = (data) => {
    const uiRoot = document.getElementsByTagName('header')[0]

    if (uiRoot) {
        const baseContainer = document.createElement('div')

        baseContainer.classList = 'modhub-2-0-base-content-container modhub-2-0-base-content-container-mod'

        baseContainer.appendChild(createUserNavbarContainer(data))

        for (let i = 0; i < data.mod.modContent.length; i++) {
            baseContainer.appendChild(data.mod.modContent[i])
        }

        baseContainer.appendChild(createFooterDescContainer(data.footerDesc))

        return uiRoot.parentNode.insertBefore(baseContainer, uiRoot.nextSibling)
    }
}

const createLoginPageInterface = (data) => {
    if (dataRoot) {
        const baseContainer = document.createElement('div')

        baseContainer.classList = 'modhub-2-0-base-login-container'

        baseContainer.appendChild(createLoginFormContainer(data.loginPage))

        return dataRoot.appendChild(baseContainer)
    }
}

const createModhubAccountModsPageInterface = (data) => {
    const baseContainer = document.createElement('div')

    baseContainer.classList = 'modhub-2-0-base-content-container modhub-2-0-base-content-container-account'

    baseContainer.appendChild(createModhubAccountNavbarContainer(data))
    baseContainer.appendChild(createModhubAccountFiltersContainer())
    baseContainer.appendChild(createModhubAccountModsListContainer(data))

    return dataRoot.appendChild(baseContainer)
}

const createModhubAccountRewardsPageInterface = (data) => {
    const uiRoot = document.getElementsByClassName('features-tabs--mods')[0]

    if (uiRoot) {
        const baseContainer = document.createElement('div')

        baseContainer.classList = 'modhub-2-0-base-content-container modhub-2-0-base-content-container-account modhub-2-0-base-content-container-account-rewards'

        baseContainer.appendChild(createModhubAccountNavbarContainer(data))

        return [uiRoot.parentNode.insertBefore(baseContainer, uiRoot.nextSibling), uiRoot.remove()]
    }
}

const createFeaturedContainer = (data) => {
    const featuredContainer = document.createElement('div')
    const featuredContainerLink = document.createElement('a')

    featuredContainer.classList = 'modhub-2-0-featured-content-container'

    featuredContainer.addEventListener('mouseenter', () => {
        const featuredInfoContainer = document.getElementById('modhub-2-0-featured-info')

        featuredInfoContainer.classList.add('modhub-2-0-featured-info-container-active')

        featuredContainerLink.classList.add('modhub-2-0-featured-content-container-overlay-link')

        featuredContainer.addEventListener('mouseleave', () => {
            let timeout = setTimeout(() => {
                if (featuredInfoContainer.classList.contains('modhub-2-0-featured-info-container-active')) {
                    featuredInfoContainer.classList.remove('modhub-2-0-featured-info-container-active')

                    if (featuredContainerLink.classList.contains('modhub-2-0-featured-content-container-overlay-link')) {
                        featuredContainerLink.classList.remove('modhub-2-0-featured-content-container-overlay-link')
                    }
                }
            }, 10000)

            featuredContainer.addEventListener('mouseenter', () => {
                clearTimeout(timeout)
            })

        })
    })

    featuredContainerLink.href = data.featured.info.button.href

    featuredContainer.appendChild(featuredContainerLink)
    featuredContainer.appendChild(createFeaturedInnerContainer(data))

    return featuredContainer
}

const createFeaturedInnerContainer = (data) => {
    const featuredInnerContainer = document.createElement('div')

    featuredInnerContainer.classList = 'modhub-2-0-featured-inner-container'
    featuredInnerContainer.style.background = data.featured.imageUrl

    featuredInnerContainer.appendChild(createFeaturedInfoContainer(data))

    return featuredInnerContainer
}

const createFeaturedInfoContainer = (data) => {
    const featuredInfoContainer = document.createElement('div')

    featuredInfoContainer.id = 'modhub-2-0-featured-info'
    featuredInfoContainer.classList = 'modhub-2-0-featured-info-container'

    featuredInfoContainer.appendChild(createFeaturedInfoPreheaderContainer(data))
    featuredInfoContainer.appendChild(createFeaturedTextContainer(data))
    featuredInfoContainer.appendChild(createFeaturedImagesContainer(data.featured.imageUrl))

    return featuredInfoContainer
}

const createFeaturedInfoPreheaderContainer = (data) => {
    const featuredInfoPreheaderContainer = document.createElement('div')

    featuredInfoPreheaderContainer.classList = 'modhub-2-0-featured-info-preheader-container'

    featuredInfoPreheaderContainer.appendChild(createFeaturedInfoPreheader(data.featured.info.preheader))

    return featuredInfoPreheaderContainer
}

const createFeaturedInfoPreheader = (preheader) => {
    const featuredInfoPreheader = document.createElement('p')

    featuredInfoPreheader.textContent = preheader

    return featuredInfoPreheader
}

const createFeaturedTextContainer = (data) => {
    const featuredInfoTextContainer = document.createElement('div')

    featuredInfoTextContainer.classList = 'modhub-2-0-featured-info-text-container'

    featuredInfoTextContainer.appendChild(createFeaturedModName(data.featured.info.modName))
    featuredInfoTextContainer.appendChild(createFeaturedModInfoContainer(data.featured.info.modInfo))

    if (data.featured.info.rating) {
        featuredInfoTextContainer.appendChild(createFeaturedModStarsContainer(data.featured.info.rating))
    }

    return featuredInfoTextContainer
}

const createFeaturedModName = (data) => {
    const featuredInfoModName = document.createElement('h3')

    featuredInfoModName.classList = 'modhub-2-0-font'
    featuredInfoModName.textContent = data

    return featuredInfoModName
}

const createFeaturedModInfoContainer = (data) => {
    const featuredInfoModInfoContainer = document.createElement('div')

    let separator = ''
    let splitedData = []

    if (data.includes('22')) {
        separator = '22'
    } else {
        separator = '19'
    }

    splitedData = data.replace(/\s{2,}/g,' ').split(separator + ' ')
    splitedData[0] = splitedData[0] + separator

    featuredInfoModInfoContainer.classList = 'modhub-2-0-featured-info-text-wrap-container'

    featuredInfoModInfoContainer.appendChild(createFeaturedModInfoVersion(splitedData[0]))
    featuredInfoModInfoContainer.appendChild(createFeaturedModInfoAuthor(splitedData[1]))

    return featuredInfoModInfoContainer
}

const createFeaturedModInfoVersion = (data) => {
    const featuredInfoModInfoVersion = document.createElement('p')

    featuredInfoModInfoVersion.classList = 'modhub-2-0-font'
    featuredInfoModInfoVersion.innerHTML = data

    return featuredInfoModInfoVersion
}

const createFeaturedModInfoAuthor = (data) => {
    const featuredInfoModInfoAuthor = document.createElement('p')

    featuredInfoModInfoAuthor.classList = 'modhub-2-0-font'
    featuredInfoModInfoAuthor.innerHTML = data

    return featuredInfoModInfoAuthor
}

const createFeaturedModStarsContainer = (data, toLeft) => {
    const featuredInfoModStarsContainer = document.createElement('div')

    featuredInfoModStarsContainer.classList = 'modhub-2-0-featured-info-stars-container'

    for (let i = 0; i < 5; i++) {
        let star = data

        if (i > 0) {
            star = star - i
        }

        featuredInfoModStarsContainer.appendChild(createFeaturedInfoModStar(star, toLeft))
    }

    return featuredInfoModStarsContainer
}

const createFeaturedInfoModStar = (data, toLeft) => {
    const featuredInfoStar = document.createElement('span')

    featuredInfoStar.classList = 'modhub-2-0-featured-info-star'

    if (toLeft === true) {
        featuredInfoStar.classList.add('modhub-2-0-featured-info-star-left')
    }

    if (data > 0.5) {
        featuredInfoStar.classList.add('modhub-2-0-featured-info-star-full')
    } else if (data == 0.5) {
        featuredInfoStar.classList.add('modhub-2-0-featured-info-star-half')
    }

    return featuredInfoStar
}

const createFeaturedImagesContainer = (data) => {
    const featuredImagesContainer = document.createElement('div')

    featuredImagesContainer.id = 'modhub-2-0-featured-info-images'
    featuredImagesContainer.classList = 'modhub-2-0-featured-info-images-container'

    for (let i = 1; i < 3; i++) {
        featuredImagesContainer.appendChild(createFeaturedImage(data.slice(0, data.indexOf('screenshot0')) + `screenshot${i}.jpg`))
    }

    return featuredImagesContainer
}

const createFeaturedImage = (data) => {
    const featuredImage = document.createElement('div')

    featuredImage.style.background = data

    return featuredImage
}

const createUserNavbarContainer = (data) => {
    const userNavbarContainer = document.createElement('div')

    userNavbarContainer.classList = 'modhub-2-0-user-navbar-container'

    userNavbarContainer.appendChild(createUserNavbarInnerContainer(data))

    return userNavbarContainer
}

const createUserNavbarInnerContainer = (data) => {
    const userNavbarInnerContainer = document.createElement('div')

    userNavbarInnerContainer.classList = 'modhub-2-0-user-navbar-inner-container'

    userNavbarInnerContainer.appendChild(createUserNavbarModhubTextContainer())
    userNavbarInnerContainer.appendChild(createUserNavbarSearchBarContainer(data))
    userNavbarInnerContainer.appendChild(createUserNavbarSeparator(true))

    const textFilters = createUserNavbarTextFilters(data.userNavbar)

    textFilters.forEach((filter, index) => {
        userNavbarInnerContainer.appendChild(filter)

        if (filter.classList.contains('modhub-2-0-user-navbar-text-filter-drop-arrow')) {
            filter.appendChild(createUserNavbarTextFilterChild(data.userNavbar[Object.keys(data.userNavbar)[index]]))

            filter.id = 'categories-drop-list'

            filter.addEventListener('click', (e) => {
                if (e.target == filter) {
                    filter.classList.toggle('modhub-2-0-user-navbar-text-filter-drop-active')

                    document.getElementById('small-screen-drop-menu').classList.toggle('modhub-2-0-user-navbar-menu-button-active', false)

                    filter.addEventListener('mouseleave', () => {
                        window.addEventListener('mouseover', handleMouseLeaveDropFilterArea)
                    })
                }
            })
        }

        if (index !== textFilters.length - 1) {
            userNavbarInnerContainer.appendChild(createUserNavbarSeparator())
        }
    })

    userNavbarInnerContainer.appendChild(createUserNavbarSeparator(true))
    userNavbarInnerContainer.appendChild(createUserNavbarLoginButton(data.userNavbar.button))
    userNavbarInnerContainer.appendChild(createUserNavbarMenu(data.userNavbar))

    return userNavbarInnerContainer
}

const handleMouseLeaveDropFilterArea = (e) => {
    const filter = document.getElementById('categories-drop-list')

    if (e.target.classList.length > 0) {
        if (!e.target.classList[0].includes('modhub-2-0-user-navbar') && !e.target.classList[0].includes('modhub-2-0-base-content')) {
            if (filter.classList.contains('modhub-2-0-user-navbar-text-filter-drop-active')) {
                filter.classList.remove('modhub-2-0-user-navbar-text-filter-drop-active')

                window.removeEventListener('mouseover', handleMouseLeaveDropFilterArea)
            }
        }
    }
}

const createUserNavbarModhubTextContainer = () => {
    const userNavbarModhubTextContainer = document.createElement('div')

    userNavbarModhubTextContainer.classList = 'modhub-2-0-user-navbar-modhub-text-container modhub-2-0-font'
    userNavbarModhubTextContainer.innerHTML = 'MODHUB'

    return userNavbarModhubTextContainer
}

const createUserNavbarSearchBarContainer = (data) => {
    const searchBarContainer = document.createElement('div')

    searchBarContainer.classList = 'modhub-2-0-user-navbar-search-container'

    searchBarContainer.appendChild(createUserNavbarSearchBarInnerContainer(data))

    return searchBarContainer
}

const createUserNavbarSearchBarInnerContainer = (data) => {
    const searchBarInnerContainer = document.createElement('div')

    searchBarInnerContainer.classList = 'modhub-2-0-user-navbar-search-inner-container'

    searchBarInnerContainer.appendChild(createUserNavbarSearchBarInnerIcon())
    searchBarInnerContainer.appendChild(createUserNavbarSearchBarInnerSeparator())
    searchBarInnerContainer.appendChild(createUserNavbarSearchBarInnerInputForm(data))

    return searchBarInnerContainer
}

const createUserNavbarSearchBarInnerIcon = () => {
    const searchBarInnerIcon = document.createElement('a')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/search.svg'

    searchBarInnerIcon.classList = 'modhub-2-0-user-navbar-search-inner-icon'

    searchBarInnerIcon.addEventListener('click', () => {
        if (document.getElementsByClassName('modhub-2-0-user-navbar-search-input')[0].value !== '') {
            document.getElementById('modhub-2-0-search-form').submit()
        }
    })

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => searchBarInnerIcon.innerHTML = result)

    return searchBarInnerIcon
}

const createUserNavbarSearchBarInnerSeparator = () => {
    const searchBarInnerSeparator = createUserNavbarSeparator()

    searchBarInnerSeparator.classList.add('modhub-2-0-user-navbar-search-bar-inner-separator')

    return searchBarInnerSeparator
}

const createUserNavbarSearchBarInnerInputForm = (data) => {
    const searchBarForm = document.createElement('form')

    searchBarForm.method = 'GET'
    searchBarForm.action = data.searchInput ? data.searchInput.action : 'https://www.farming-simulator.com/mods.php?lang=pl&country=pl'
    searchBarForm.id = 'modhub-2-0-search-form'
    searchBarForm.classList = 'modhub-2-0-user-navbar-search-form'

    const searchHiddenInput = document.createElement('input') // Not sure for what giants made it, but maybe it's necessary so I made it too

    searchHiddenInput.type = 'hidden'
    searchHiddenInput.name = data.searchInput ? data.searchInput.name1 : 'title'
    searchHiddenInput.value = data.searchInput ? data.searchInput.inputValue : 'fs2022'

    searchBarForm.appendChild(searchHiddenInput)

    const searchInput = document.createElement('input')

    searchInput.type = 'text'
    searchInput.name = data.searchInput ? data.searchInput.name2 : 'searchMod'
    searchInput.placeholder = data.searchInput ? data.searchInput.placeholder : 'Search Mods'
    searchInput.classList = 'modhub-2-0-user-navbar-search-input'

    searchInput.addEventListener('input', () => {
        const searchBarInnerIcon = document.getElementsByClassName('modhub-2-0-user-navbar-search-inner-icon')[0]

        if (searchInput.value == '') {

            if (searchBarInnerIcon) {
                searchBarInnerIcon.classList.remove('modhub-2-0-user-navbar-search-inner-icon-no-placeholder')
            }
        } else {
            searchBarInnerIcon.classList.add('modhub-2-0-user-navbar-search-inner-icon-no-placeholder')
        }
    })

    searchBarForm.appendChild(searchInput)

    return searchBarForm
}

const createUserNavbarTextFilters = (data) => {
    const filtersKeys = Object.keys(data)
    const filters = []

    filtersKeys.forEach((filterKey, index) => {
        if (filterKey !== 'button') {
            const textFilter = document.createElement('a')

            textFilter.classList = 'modhub-2-0-user-navbar-text-filter modhub-2-0-font'

            if (data[filterKey].active) {
                textFilter.classList.add('modhub-2-0-user-navbar-text-filter-active')
            }

            if (data[filterKey].href) {
                textFilter.href = data[filterKey].href
            } else {
                textFilter.classList.add('modhub-2-0-user-navbar-text-filter-drop-arrow')
            }

            textFilter.textContent = index !== 4 ? convertUpperCaseStringToFirstCharUpperCase(filterKey) : filterKey

            filters.push(textFilter)
        }
    })

    swapArrayElementByIndexes(filters, 5, 4)

    return filters
}

const createUserNavbarTextFilterChild = (data) => {
    const userNavbarFilterChild = document.createElement('div')

    userNavbarFilterChild.classList = 'modhub-2-0-user-navbar-text-filter-child'

    userNavbarFilterChild.appendChild(createUserNavbarTextFilterChildList(data))

    userNavbarFilterChild.addEventListener('mouseenter', () => {
        userNavbarFilterChild.addEventListener('mouseleave', (e) => {
            const parentFilter = e.fromElement.parentElement

            if (parentFilter.classList.contains('modhub-2-0-user-navbar-text-filter-drop-active')) {
                parentFilter.classList.remove('modhub-2-0-user-navbar-text-filter-drop-active')
            }
        })
    })

    return userNavbarFilterChild
}

const createUserNavbarTextFilterChildList = (data) => {
    const userNavbarFilterChildList = document.createElement('ul')

    userNavbarFilterChildList.classList = 'modhub-2-0-user-navbar-text-filter-child-list'

    for (let i = 0; i < Object.keys(data).length; i++) {
        const itemName = Object.keys(data)[i]
        const itemHref = data[itemName]

        userNavbarFilterChildList.appendChild(createUserNavbarTextFilterChildListItem(itemName, itemHref))
    }

    return userNavbarFilterChildList
}

const createUserNavbarTextFilterChildListItem = (name, href) => {
    const userNavbarFilterChildListItem = document.createElement('li')
    const userNavbarFilterChildListItemLink = document.createElement('a')

    userNavbarFilterChildListItemLink.href = href
    userNavbarFilterChildListItemLink.textContent = name

    userNavbarFilterChildListItem.classList = 'modhub-2-0-user-navbar-text-filter-child-list-item'

    userNavbarFilterChildListItem.appendChild(userNavbarFilterChildListItemLink)

    return userNavbarFilterChildListItem
}

const createUserNavbarLoginButton = (data) => {
    const userNavbarLoginBtn = document.createElement('a')

    userNavbarLoginBtn.href = data.href
    userNavbarLoginBtn.title = convertUpperCaseStringToFirstCharUpperCase(data.text)
    userNavbarLoginBtn.classList = 'modhub-2-0-user-navbar-login-button'

    userNavbarLoginBtn.appendChild(createUserNavbarLoginButtonIcon())

    return userNavbarLoginBtn
}

const createUserNavbarLoginButtonIcon = () => {
    const userNavbarLoginBtnIcon = document.createElement('div')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/sign-in-alt.svg'

    userNavbarLoginBtnIcon.classList = 'modhub-2-0-user-navbar-login-button-icon'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => userNavbarLoginBtnIcon.innerHTML = result)

    return userNavbarLoginBtnIcon
}

const createUserNavbarMenu = (data) => {
    const userNavbarMenu = document.createElement('a')

    userNavbarMenu.id = 'small-screen-drop-menu'
    userNavbarMenu.classList = 'modhub-2-0-user-navbar-login-button modhub-2-0-user-navbar-menu-button'

    userNavbarMenu.appendChild(createUserNavbarMenuButtonIcon())
    userNavbarMenu.appendChild(createUserNavbarMenuContainer(data))

    userNavbarMenu.addEventListener('click', (e) => {
        if (e.target == userNavbarMenu) {
            userNavbarMenu.classList.toggle('modhub-2-0-user-navbar-menu-button-active')

            document.getElementById('categories-drop-list').classList.toggle('modhub-2-0-user-navbar-text-filter-drop-active', false)

            userNavbarMenu.addEventListener('mouseleave', () => {
                window.addEventListener('mouseover', handleMouseLeaveDropMenuArea)
            })
        }
    })

    return userNavbarMenu
}

const handleMouseLeaveDropMenuArea = (e) => {
    const menuButton = document.getElementById('small-screen-drop-menu')

    if (e.target.classList.length > 0) {
        if (!e.target.classList[0].includes('modhub-2-0-user-navbar') && !e.target.classList[0].includes('modhub-2-0-base-content')) {
            if (menuButton.classList.contains('modhub-2-0-user-navbar-menu-button-active')) {
                menuButton.classList.remove('modhub-2-0-user-navbar-menu-button-active')

                window.removeEventListener('mouseover', handleMouseLeaveDropMenuArea)
            }
        }
    }
}

const createUserNavbarMenuButtonIcon = () => {
    const userNavbarMenuBtnIcon = document.createElement('div')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/menu-burger.svg'

    userNavbarMenuBtnIcon.classList = 'modhub-2-0-user-navbar-login-button-icon'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => userNavbarMenuBtnIcon.innerHTML = result)

    return userNavbarMenuBtnIcon
}

const createUserNavbarMenuContainer = (data) => {
    const userNavbarMenuContainer = document.createElement('div')

    userNavbarMenuContainer.classList = 'modhub-2-0-user-navbar-menu-container'

    userNavbarMenuContainer.addEventListener('mouseenter', () => {
        userNavbarMenuContainer.addEventListener('mouseleave', () => {
            const parentButton = document.getElementById('small-screen-drop-menu')

            if (parentButton.classList.contains('modhub-2-0-user-navbar-menu-button-active')) {
                parentButton.classList.remove('modhub-2-0-user-navbar-menu-button-active')
            }
        })
    })

    userNavbarMenuContainer.appendChild(createUserNavbarMenuInnerContainer(data))

    return userNavbarMenuContainer
}

const createUserNavbarMenuInnerContainer = (data) => {
    const userNavbarMenuInnerContainer = document.createElement('div')

    userNavbarMenuInnerContainer.classList = 'modhub-2-0-user-navbar-menu-inner-container'

    const textFilters = createUserNavbarTextFilters(data)

    textFilters.forEach((filter, index) => {
        userNavbarMenuInnerContainer.appendChild(filter)

        if (filter.classList.contains('modhub-2-0-user-navbar-text-filter-drop-arrow')) {
            filter.appendChild(createUserNavbarTextFilterChild(data[Object.keys(data)[index]]))

            filter.addEventListener('click', (e) => {
                if (e.target == filter) {
                    filter.classList.toggle('modhub-2-0-user-navbar-text-filter-drop-active')
                }
            })
        }

        if (index !== textFilters.length - 1) {
            const userNavbarMenuSeparator = createUserNavbarSeparator()

            userNavbarMenuSeparator.classList.add('modhub-2-0-user-navbar-menu-horizontal-separator')

            userNavbarMenuInnerContainer.appendChild(userNavbarMenuSeparator)
        }
    })

    const userNavbarMenuSeparator = createUserNavbarSeparator()

    userNavbarMenuSeparator.classList.add('modhub-2-0-user-navbar-menu-horizontal-separator')

    userNavbarMenuInnerContainer.appendChild(userNavbarMenuSeparator)
    userNavbarMenuInnerContainer.appendChild(createUserNavbarMenuLoginButton(data.button))

    return userNavbarMenuInnerContainer
}

const createUserNavbarMenuLoginButton = (data) => {
    const userNavbarMenuLoginBtn = document.createElement('a')

    userNavbarMenuLoginBtn.href = data.href
    userNavbarMenuLoginBtn.title = convertUpperCaseStringToFirstCharUpperCase(data.text)
    userNavbarMenuLoginBtn.classList = 'modhub-2-0-user-navbar-login-button modhub-2-0-user-navbar-menu-login-button'

    userNavbarMenuLoginBtn.appendChild(createUserNavbarLoginButtonIcon())
    userNavbarMenuLoginBtn.appendChild(createUserNavbarMenuLoginButtonText(userNavbarMenuLoginBtn.title))

    return userNavbarMenuLoginBtn
}

const createUserNavbarMenuLoginButtonText = (data) => {
    const userNavbarMenuLoginBtnText = document.createElement('p')

    userNavbarMenuLoginBtnText.innerHTML = data
    userNavbarMenuLoginBtnText.classList = 'modhub-2-0-font'

    return userNavbarMenuLoginBtnText
}

const createUserNavbarSeparator = (isBig) => {
    const userNavbarSeparator = document.createElement('div')

    userNavbarSeparator.classList = 'modhub-2-0-user-navbar-separator'

    if (isBig) {
        userNavbarSeparator.classList.add('modhub-2-0-separator-big')
    }

    return userNavbarSeparator
}

const createModsItemsContainer = (data) => {
    const modsItemsContainer = document.createElement('div')

    modsItemsContainer.classList = 'modhub-2-0-mods-items-container'

    if (data.featuredMods) {
        for (let i = 0; i < Object.keys(data.featuredMods).length; i++) {
            modsItemsContainer.appendChild(createFeaturedModsItemsItem(data.featuredMods[i], i))
        }
    }

    for (let i = 0; i < Object.keys(data.modsItems).length; i++) {
        modsItemsContainer.appendChild(createModsItemsItem(data.modsItems[i]))
    }

    return modsItemsContainer
}

const createFeaturedModsItemsItem = (data ,index) => {
    const featuredModItem = document.createElement('div')

    featuredModItem.classList = 'modhub-2-0-mods-items-item modhub-2-0-mods-items-item-featured'

    featuredModItem.appendChild(createFeaturedModsItemInnerContainer(data, index))

    return featuredModItem
}

const createFeaturedModsItemInnerContainer = (data, index) => {
    const featuredModItemInnerContainer = document.createElement('div')
    const featuredModItemInnerLink = document.createElement('a')

    featuredModItemInnerLink.href = data.modHref
    featuredModItemInnerLink.classList = 'modhub-2-0-mods-items-item-inner-link'

    featuredModItemInnerContainer.classList = 'modhub-2-0-mods-items-item-featured-inner-container'

    featuredModItemInnerContainer.appendChild(featuredModItemInnerLink)
    featuredModItemInnerContainer.appendChild(createFeaturedModsItemHeader(data, index))
    featuredModItemInnerContainer.appendChild(createFeaturedModsItemContent(data))

    return featuredModItemInnerContainer
}

const createFeaturedModsItemHeader = (data, index) => {
    const featuredModItemHeader = document.createElement('div')

    featuredModItemHeader.classList = 'modhub-2-0-mods-items-item-featured-header-container'

    featuredModItemHeader.appendChild(createFeaturedModsItemHeaderInnerContainer(data, index))

    return featuredModItemHeader
}

const createFeaturedModsItemHeaderInnerContainer = (data, index) => {
    const featuredModItemHeaderInnerContainer = document.createElement('div')

    featuredModItemHeaderInnerContainer.classList = 'modhub-2-0-mods-items-item-featured-header-inner-container'

    featuredModItemHeaderInnerContainer.appendChild(createFeaturedModsItemHeaderTitleContainer(data, index))
    featuredModItemHeaderInnerContainer.appendChild(createFeaturedModsItemHeaderPriceText(data))

    return featuredModItemHeaderInnerContainer
}

const createFeaturedModsItemHeaderTitleContainer = (data, index) => {
    const featuredModItemHeaderTitleContainer = document.createElement('div')

    featuredModItemHeaderTitleContainer.classList = 'modhub-2-0-mods-items-item-featured-header-title-container'

    featuredModItemHeaderTitleContainer.appendChild(createFeaturedModsItemHeaderTitleIcon(index))
    featuredModItemHeaderTitleContainer.appendChild(createFeaturedModsItemHeaderTitleText(data))

    return featuredModItemHeaderTitleContainer
}

const createFeaturedModsItemHeaderTitleIcon = (data) => {
    const featuredModItemHeaderTitleIcon = document.createElement('img')
    let iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/favorites.png'

    featuredModItemHeaderTitleIcon.classList = 'modhub-2-0-mods-items-item-featured-header-title-icon'

    if (data > 0) {
        iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/badge.png'

        featuredModItemHeaderTitleIcon.classList = 'modhub-2-0-mods-items-item-featured-header-title-icon-smaller'
    }

    featuredModItemHeaderTitleIcon.src = iconUrl
    featuredModItemHeaderTitleIcon.alt = 'Featured mod header icon'

    return featuredModItemHeaderTitleIcon
}

const createFeaturedModsItemHeaderTitleText = (data) => {
    const featuredModItemHeaderTitleText = document.createElement('p')

    featuredModItemHeaderTitleText.textContent = convertUpperCaseStringToFirstCharUpperCase(data.featuredTitle)
    featuredModItemHeaderTitleText.classList = 'modhub-2-0-font'

    return featuredModItemHeaderTitleText
}

const createFeaturedModsItemHeaderPriceText = (data) => {
    const featuredModItemHeaderPriceText = document.createElement('p')

    featuredModItemHeaderPriceText.textContent = convertUpperCaseStringToFirstCharUpperCase(data.featuredPrice)
    featuredModItemHeaderPriceText.classList = 'modhub-2-0-font modhub-2-0-mods-items-item-featured-header-price'

    return featuredModItemHeaderPriceText
}

const createFeaturedModsItemContent = (data) => {
    const featuredModItemContent = document.createElement('div')

    featuredModItemContent.classList = 'modhub-2-0-mods-items-item-featured-content'

    featuredModItemContent.appendChild(createFeaturedModsItemImageContainer(data))
    featuredModItemContent.appendChild(createFeaturedModsItemTextContainer(data))

    return featuredModItemContent 
}

const createFeaturedModsItemImageContainer = (data) => {
    const featuredModItemImgContainer = document.createElement('div')

    featuredModItemImgContainer.classList = 'modhub-2-0-mods-items-item-featured-img-container'

    featuredModItemImgContainer.appendChild(createModItemImageContainer(data))

    return featuredModItemImgContainer
}

const createFeaturedModsItemTextContainer = (data) => {
    const featuredModItemTextContainer = document.createElement('div')

    featuredModItemTextContainer.classList = 'modhub-2-0-mods-items-item-featured-text-container'

    featuredModItemTextContainer.appendChild(createFeaturedModsItemInnerTextContainer(data))

    return featuredModItemTextContainer
}

const createFeaturedModsItemInnerTextContainer = (data) => {
    const featuredModItemInnerTextContainer = document.createElement('div')
    const featuredModItemTextInfo = createFeaturedModInfoContainer(data.modInfo)
    const featuredModItemTextName = createFeaturedModName(data.modName)

    featuredModItemTextInfo.classList.add('modhub-2-0-mods-items-item-featured-text')
    featuredModItemTextName.classList.add('modhub-2-0-mods-items-item-featured-text')

    featuredModItemInnerTextContainer.classList = 'modhub-2-0-mods-items-item-featured-text-inner-container'

    featuredModItemInnerTextContainer.appendChild(featuredModItemTextName)
    featuredModItemInnerTextContainer.appendChild(featuredModItemTextInfo)
    featuredModItemInnerTextContainer.appendChild(createModItemRatingContainer(data))

    return featuredModItemInnerTextContainer
}

const createModsItemsItem = (data) => {
    const modItem = document.createElement('div')

    modItem.classList = 'modhub-2-0-mods-items-item'

    modItem.appendChild(createModItemInnerContainer(data))

    return modItem
}

const createModItemInnerContainer = (data) => {
    const modItemInnerContainer = document.createElement('div')
    const modItemInnerLink = document.createElement('a')

    modItemInnerLink.href = data.modHref
    modItemInnerLink.classList = 'modhub-2-0-mods-items-item-inner-link'

    modItemInnerContainer.classList = 'modhub-2-0-mods-items-item-inner-container'

    modItemInnerContainer.appendChild(modItemInnerLink)
    modItemInnerContainer.appendChild(createModItemImageContainer(data))
    modItemInnerContainer.appendChild(createModItemTextContainer(data))

    return modItemInnerContainer
}

const createModItemImageContainer = (data) => {
    const modItemImgContainer = document.createElement('div')

    modItemImgContainer.classList = 'modhub-2-0-mods-items-item-img-container'

    modItemImgContainer.appendChild(createModItemImage(data))

    if (data.modLabel) {
        modItemImgContainer.appendChild(createModItemLabel(data.modLabel))

        const modLabel = data.modLabel.toLowerCase()

        if (modLabel.includes('new')) {
            modItemImgContainer.classList.add('modhub-2-0-mods-items-item-img-new')
        }

        if (modLabel.includes('update')) {
            modItemImgContainer.classList.add('modhub-2-0-mods-items-item-img-update')
        }

        if (modLabel.includes('prefab')) {
            modItemImgContainer.classList.add('modhub-2-0-mods-items-item-img-prefab')
        }
    }

    return modItemImgContainer
}

const createModItemImage = (data) => {
    const modItemImgWrapper = document.createElement('div')
    const modItemImg = document.createElement('img')

    modItemImg.src = data.modImage
    modItemImg.alt = 'Mod store icon'

    modItemImgWrapper.classList = 'modhub-2-0-mods-items-item-img-wrapper-container'

    modItemImgWrapper.appendChild(modItemImg)

    return modItemImgWrapper
}

const createModItemLabel = (data) => {
    const modItemLabel = document.createElement('div')

    modItemLabel.classList = 'modhub-2-0-mods-items-item-label modhub-2-0-font'
    modItemLabel.innerHTML = data

    if (data) {
        const modLabel = data.toLowerCase()

        if (modLabel.includes('new')) {
            modItemLabel.classList.add('modhub-2-0-mods-items-item-label-new')
        }

        if (modLabel.includes('update')) {
            modItemLabel.classList.add('modhub-2-0-mods-items-item-label-update')
        }

        if (modLabel.includes('prefab')) {
            modItemLabel.classList.add('modhub-2-0-mods-items-item-label-prefab')
        }
    }

    return modItemLabel
}

const createModItemTextContainer = (data) => {
    const modItemTextContainer = document.createElement('div')

    modItemTextContainer.classList = 'modhub-2-0-mods-items-item-text-container'

    modItemTextContainer.appendChild(createModItemName(data.modName))
    modItemTextContainer.appendChild(createModItemAuthor(data.modAuthor))

    if (data.rating) {
        modItemTextContainer.appendChild(createModItemRatingContainer(data))
    }

    return modItemTextContainer
}

const createModItemName = (data) => {
    const modItemName = document.createElement('p')

    modItemName.textContent = data
    modItemName.classList = 'modhub-2-0-mods-items-item-name modhub-2-0-font'

    return modItemName
}

const createModItemAuthor = (data) => {
    const modItemAuthor = document.createElement('p')

    modItemAuthor.textContent = data.split(': ')[1]
    modItemAuthor.classList = 'modhub-2-0-mods-items-item-author modhub-2-0-font'

    return modItemAuthor
}

const createModItemRatingContainer = (data) => {
    const modItemRatingContainer = document.createElement('div')

    modItemRatingContainer.classList = 'modhub-2-0-mods-items-item-rating-container'

    if (data.rating) {
        modItemRatingContainer.appendChild(createFeaturedModStarsContainer(data.rating.stars, true))
        modItemRatingContainer.appendChild(createModItemRatingText(data.rating.count))
    }

    return modItemRatingContainer
}

const createModItemRatingText = (data) => {
    const modItemRatingText = document.createElement('div')

    modItemRatingText.innerHTML = data
    modItemRatingText.classList = 'modhub-2-0-mods-items-item-rating-text modhub-2-0-font'

    return modItemRatingText
}

const createLoginFormContainer = (data) => {
    const loginFormContainer = document.createElement('div')

    loginFormContainer.classList = 'modhub-2-0-login-form-container'

    loginFormContainer.appendChild(createLoginForm(data))

    return loginFormContainer
}

const createLoginForm = (data) => {
    const loginForm = document.createElement('form')

    loginForm.method = data.method.toUpperCase()
    loginForm.action = data.action

    loginForm.appendChild(createLoginFormInnerContainer(data))

    return loginForm
}

const createLoginFormInnerContainer = (data) => {
    const loginFormInnerContainer = document.createElement('div')

    loginFormInnerContainer.classList = 'modhub-2-0-login-form-inner-container'

    loginFormInnerContainer.appendChild(createLoginFormGiantsInputTrash()) // Not sure for what giants made it, but it's necessary so I made it too
    loginFormInnerContainer.appendChild(createLoginFormInputEmail(data))
    loginFormInnerContainer.appendChild(createLoginFormInputPassword(data))
    loginFormInnerContainer.appendChild(createLoginOptionsContainer(data))

    return loginFormInnerContainer
}

const createLoginFormGiantsInputTrash = () => {
    return createLoginInput('hidden', 'greenstoneX', '1')
}

const createLoginFormInputEmail = (data) => {
    const emailInputContainer = document.createElement('div')

    emailInputContainer.classList = 'modhub-2-0-login-input-container'

    emailInputContainer.appendChild(createLoginInput('text', 'redstoneX'))
    emailInputContainer.appendChild(createLoginInputPlaceholder(data.emailText))

    return emailInputContainer
}

const createLoginFormInputPassword = (data) => {
    const passwordInputContainer = document.createElement('div')

    passwordInputContainer.classList = 'modhub-2-0-login-input-container'

    passwordInputContainer.appendChild(createLoginInput('password', 'bluestoneX'))
    passwordInputContainer.appendChild(createLoginInputPlaceholder(data.passwordText))

    return passwordInputContainer
}

const createLoginInput = (type, name, value) => {
    const loginInput = document.createElement('input')

    loginInput.type = type
    loginInput.name = name

    value ? loginInput.value = value : null

    loginInput.placeholder = ' '
    loginInput.classList = 'modhub-2-0-login-form-input modhub-2-0-font'

    return loginInput
}

const createLoginInputPlaceholder = (data) => {
    const loginInputPlaceholder = document.createElement('span')

    loginInputPlaceholder.classList = 'modhub-2-0-login-form-input-placeholder modhub-2-0-font'
    loginInputPlaceholder.textContent = data

    return loginInputPlaceholder
}

const createLoginOptionsContainer = (data) => {
    const loginOptionsContainer = document.createElement('div')

    loginOptionsContainer.classList = 'modhub-2-0-login-form-options-container'

    loginOptionsContainer.appendChild(createLoginTextOptionsContainer(data))
    loginOptionsContainer.appendChild(createLoginFormSubmitButton(data))

    return loginOptionsContainer
}

const createLoginTextOptionsContainer = (data) => {
    const loginTextOptionsContainer = document.createElement('div')

    loginTextOptionsContainer.classList = 'modhub-2-0-login-form-text-options-container'

    loginTextOptionsContainer.appendChild(createLoginOptionText(data.passwordResetText, data.passwordResetHref))
    loginTextOptionsContainer.appendChild(createLoginOptionText(data.newAccountText, data.newAccountHref))

    return loginTextOptionsContainer
}

const createLoginOptionText = (text, href) => {
    const loginOptionText = document.createElement('a')

    loginOptionText.href = href
    loginOptionText.textContent = text
    loginOptionText.classList = 'modhub-2-0-font'

    return loginOptionText
}

const createLoginFormSubmitButton = (data) => {
    const loginFormSubmitButtonContainer = document.createElement('button')

    loginFormSubmitButtonContainer.type = data.loginButtonType
    loginFormSubmitButtonContainer.textContent = data.loginButtonValue
    loginFormSubmitButtonContainer.classList = 'modhub-2-0-login-form-submit-button modhub-2-0-font'

    return loginFormSubmitButtonContainer
}

const createModhubAccountNavbarContainer = (data) => {
    const navbarContainer = document.createElement('div')

    navbarContainer.classList = 'modhub-2-0-account-navbar-container'

    navbarContainer.appendChild(createModhubAccountNavbarInnerContainer(data))

    return navbarContainer
}

const createModhubAccountNavbarInnerContainer = (data) => {
    const navbarInnerContainer = document.createElement('div')

    navbarInnerContainer.classList = 'modhub-2-0-account-navbar-inner-container'

    navbarInnerContainer.appendChild(createModhubAccountNavbarTabsContainer(data))
    navbarInnerContainer.appendChild(createModhubAccountNavbarLogoutButtonContainer(data))

    return navbarInnerContainer
}

const createModhubAccountNavbarTabsContainer = (data) => {
    const navbarTabsContainer = document.createElement('div')

    navbarTabsContainer.classList = 'modhub-2-0-account-navbar-tabs-container'

    for (let i = 0; i < Object.keys(data.modsNavbar).length; i++) {
        const navbarItemKey = Object.keys(data.modsNavbar)[i]
        const navbarItemValue = data.modsNavbar[navbarItemKey]

        if (typeof navbarItemValue === 'object') {
            navbarTabsContainer.appendChild(createModhubAccountNavbarTab(navbarItemKey, navbarItemValue))

            if (i < Object.keys(data.modsNavbar).length - 3) {
                navbarTabsContainer.appendChild(createUserNavbarSeparator())
            }
        }
    }

    return navbarTabsContainer
}

const createModhubAccountNavbarTab = (tabName, tabData) => {
    const navbarTab = document.createElement('a')

    navbarTab.textContent = tabName
    navbarTab.href = tabData.href

    navbarTab.classList = 'modhub-2-0-user-navbar-text-filter'

    if (tabData.active) {
        navbarTab.classList.add('modhub-2-0-user-navbar-text-filter-active')
    }

    return navbarTab
}

const createModhubAccountNavbarLogoutButtonContainer = (data) => {
    const navbarButtonContainer = document.createElement('div')

    navbarButtonContainer.classList = 'modhub-2-0-account-navbar-button-container'

    navbarButtonContainer.appendChild(createModhubAccountNavbarLogoutButton(data))

    return navbarButtonContainer
}

const createModhubAccountNavbarLogoutButton = (data) => {
    const navbarButton = document.createElement('a')

    navbarButton.href = data.modsNavbar.logoutHref

    navbarButton.appendChild(createModhubAccountNavbarLogoutButtonIcon())
    navbarButton.appendChild(createModhubAccountNavbarLogoutButtonText(data.modsNavbar.logoutText))

    return navbarButton
}

const createModhubAccountNavbarLogoutButtonIcon = () => {
    const navbarButtonIcon = document.createElement('div')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/sign-in-alt.svg'

    navbarButtonIcon.classList = 'modhub-2-0-account-navbar-button-icon'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => navbarButtonIcon.innerHTML = result)

    return navbarButtonIcon
}

const createModhubAccountNavbarLogoutButtonText = (data) => {
    const navbarButtonText = document.createElement('p')

    navbarButtonText.textContent = data

    return navbarButtonText
}

const createModhubAccountFiltersContainer = () => {
    const filtersContainer = document.createElement('div')

    filtersContainer.classList = 'modhub-2-0-account-mods-filters-container'

    filtersContainer.appendChild(createModhubAccountFiltersInnerContainer())

    return filtersContainer
}

const createModhubAccountFiltersInnerContainer = () => {
    const filtersInnerContainer = document.createElement('div')

    filtersInnerContainer.classList = 'modhub-2-0-account-mods-filters-inner-container'

    filtersInnerContainer.appendChild(createModhubAccountSearchContainer())
    filtersInnerContainer.appendChild(createModhubAccountFiltersButtonContainer())
    filtersInnerContainer.appendChild(createModhubAccountActiveFiltersContainer())

    return filtersInnerContainer
}

const createModhubAccountSearchContainer = () => {
    const searchContainer = document.createElement('div')

    searchContainer.classList = 'modhub-2-0-account-mods-filters-search-container'

    searchContainer.appendChild(createModhubAccountSearchInputContainer())

    return searchContainer
}

const createModhubAccountSearchInputContainer = () => {
    const searchInputContainer = document.createElement('div')

    searchInputContainer.classList = 'modhub-2-0-account-mods-filters-search-input-container'

    searchInputContainer.appendChild(createModhubAccountSearchIcon())
    searchInputContainer.appendChild(createModhubAccountSearchInput())

    return searchInputContainer
}

const createModhubAccountSearchIcon = () => {
    const searchIcon = document.createElement('div')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/search.svg'

    searchIcon.classList = 'modhub-2-0-account-mods-filters-search-icon'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => searchIcon.innerHTML = result)

    return searchIcon
}

const createModhubAccountSearchInput = () => {
    const searchInput = document.createElement('input')

    searchInput.type = 'text'
    searchInput.placeholder = 'Search mod by name'
    searchInput.classList = 'modhub-2-0-account-mods-filters-search-input'

    searchInput.addEventListener('keyup', handleModhubAccountSearch)

    return searchInput
}

const handleModhubAccountSearch = async (e) => {
    const searchValue = e.target.value
    const searchRoot = document.getElementById('modhub-2-0-mods-list')
    const searchTarget = searchRoot.children

    filteredSearchResult = []

    for (let i = 0; i < Object.keys(searchTarget).length; i++) {
        const targetRow = searchTarget[i]

        if (targetRow.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            const targetModName = targetRow.children[0].children[0].textContent

            if (searchRoot.getAttribute('data-is-filtered') !== 'true') {
                if (!targetModName.toUpperCase().includes(searchValue.toUpperCase())) {
                    targetRow.style.display = 'none'

                    setModhubAccountModsListTableRowHighlited()
                } else {
                    targetRow.style.display = ''

                    setModhubAccountModsListTableRowHighlited()
                }
            } else {
                if (!targetModName.toUpperCase().includes(searchValue.toUpperCase())) {
                    filteredSearchResult.push(targetRow)
                }
            }
        }
    }

    if (searchRoot.getAttribute('data-is-filtered') === 'true') {
        filterModsList()

        filteredSearchResult.forEach((element) => {
            element.style.display = 'none'

            setModhubAccountModsListTableRowHighlited()
        })
    }

    updateModhubAccountModsListTableSummaryRow()
}

const createModhubAccountFiltersButtonContainer = () => {
    const buttonContainer = document.createElement('div')

    buttonContainer.id = 'modhub-2-0-account-mods-filters-button-relative'
    buttonContainer.classList = 'modhub-2-0-account-mods-filters-button-container'

    buttonContainer.appendChild(createModhubAccountFiltersButton())
    buttonContainer.appendChild(createModhubAccountFiltersOverlay())

    filters.forEach((filter) => {
        const filterChilds = filtersChilds[filter]

        if (filterChilds !== null) {
            buttonContainer.appendChild(createModhubAccountFiltersOverlayFilterChildOverlay(filter, filterChilds))
        }
    })

    return buttonContainer
}

const createModhubAccountFiltersButton = () => {
    const filterButton = document.createElement('a')

    filterButton.classList = 'modhub-2-0-account-mods-filters-button'

    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/filter.svg'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => filterButton.innerHTML = result)

    filterButton.addEventListener('click', handleClickModhubAccountFiltersOverlay)

    return filterButton
}

const createModhubAccountFiltersOverlay = () => {
    const filtersOverlay = document.createElement('div')

    filtersOverlay.id = 'modhub-2-0-mods-filters-overlay'
    filtersOverlay.classList = 'modhub-2-0-account-mods-filters-overlay'

    filtersOverlay.appendChild(createModhubAccountFiltersOverlayInnerContainer())
    filtersOverlay.setAttribute('data-mods-filters-element', '')

    return filtersOverlay
}

const handleClickModhubAccountFiltersOverlay = (e) => {
    const filtersOverlay = document.getElementById('modhub-2-0-mods-filters-overlay')

    filtersOverlay.classList.add('modhub-2-0-account-mods-filters-overlay-active')

    window.addEventListener('mouseover', handleMouseLeaveModhubAccountFiltersOverlay)
}

const handleMouseLeaveModhubAccountFiltersOverlay = (e) => {
    const filtersOverlay = document.getElementById('modhub-2-0-mods-filters-overlay')

    if (e.target.getAttribute('data-mods-filters-element') !== '' && !e.target.classList.contains('modhub-2-0-base-content-container-account')) {
        filtersOverlay.classList.remove('modhub-2-0-account-mods-filters-overlay-active')

        const filtersOverlayLabels = document.getElementsByClassName('modhub-2-0-account-mods-filters-filter-label')

        for (let i = 0; i < filtersOverlayLabels.length; i++) {
            filtersOverlayLabels[i].classList.remove('modhub-2-0-account-mods-filters-filter-label-child-active')
        }

        const filtersChildOverlays = document.querySelectorAll('[data-filter-overlay-id]')

        for (let i = 0; i < filtersChildOverlays.length; i++) {
            filtersChildOverlays[i].classList.remove('modhub-2-0-account-mods-filters-filter-child-overlay-active')
        }

        window.removeEventListener('mouseover', handleMouseLeaveModhubAccountFiltersOverlay)
    }
}

const createModhubAccountFiltersOverlayInnerContainer = () => {
    const filtersOverlayInnerContainer = document.createElement('div')

    filtersOverlayInnerContainer.classList = 'modhub-2-0-account-mods-filters-overlay-inner-container'

    filtersOverlayInnerContainer.setAttribute('data-mods-filters-element', '')

    filters.forEach((filter) => {
        filtersOverlayInnerContainer.appendChild(createModhubAccountFiltersOverlayFilterContainer(filter, filtersChilds[filter]))
    })

    filtersOverlayInnerContainer.addEventListener('mouseover', handleMouseOverModhubAccountFiltersFilterOverlay)

    return filtersOverlayInnerContainer
}

const createModhubAccountFiltersOverlayFilterContainer = (filter, filterChilds) => {
    const filterContainer = document.createElement('div')

    filterContainer.classList = 'modhub-2-0-account-mods-filters-filter-container'

    filterContainer.appendChild(createModhubAccountFiltersOverlayFilter(filter, filterChilds))

    return filterContainer
}

const createModhubAccountFiltersOverlayFilter = (filter, filterChilds) => {
    const filterLabel = document.createElement('label')

    filterLabel.classList = 'modhub-2-0-account-mods-filters-filter-label'
    filterLabel.textContent = filter

    filterLabel.setAttribute('data-mods-filters-element', '')

    if (filterChilds === null) {
        filterLabel.appendChild(createModhubAccountFiltersOverlayFilterInput(filter))
        filterLabel.appendChild(createModhubAccountFiltersOverlayFilterIcon())
    } else {
        filterLabel.setAttribute('data-filter-overlay-child-id', filter)
        filterLabel.appendChild(createModhubAccountFiltersOverlayFilterChildIcon())
    }

    return filterLabel
}

const handleMouseOverModhubAccountFiltersFilterOverlay = (e) => {
    const filtersChildOverlays = document.querySelectorAll('[data-filter-overlay-id]')
    const currentTarget = e.target
    const childOverlayId = currentTarget.getAttribute('data-filter-overlay-child-id')

    for (let i = 0; i < filtersChildOverlays.length; i++) {
        const filterChildOverlay = filtersChildOverlays[i]

        if (filterChildOverlay.getAttribute('data-filter-overlay-id') == childOverlayId) {
            currentTarget.classList.add('modhub-2-0-account-mods-filters-filter-label-child-active')

            if (filterChildOverlay.style.top === '') {
                const relativeElement = document.getElementById('modhub-2-0-account-mods-filters-button-relative').getBoundingClientRect()

                filterChildOverlay.style.top = currentTarget.getBoundingClientRect().top - relativeElement.top + 'px'
            }

            filterChildOverlay.classList.add('modhub-2-0-account-mods-filters-filter-child-overlay-active')
        } else {
            if (filterChildOverlay.classList.contains('modhub-2-0-account-mods-filters-filter-child-overlay-active')) {
                filterChildOverlay.classList.remove('modhub-2-0-account-mods-filters-filter-child-overlay-active')
            }

            if (lastFilterChildTarget !== currentTarget && lastFilterChildTarget !== undefined) {
                lastFilterChildTarget.classList.remove('modhub-2-0-account-mods-filters-filter-label-child-active')
            }
        }
    }

    lastFilterChildTarget = currentTarget
}

const createModhubAccountFiltersOverlayFilterInput = (filter) => {
    const filterInput = document.createElement('input')

    filterInput.setAttribute('data-modhub-2-0-filter', filter)
    filterInput.type = 'checkbox'
    filterInput.checked = getIsModsFilterActive(filter)

    filterInput.addEventListener('change', handleChangeModhubAccountModsFilters)

    return filterInput
}

const handleChangeModhubAccountModsFilters = (e) => {
    const filterId = e.target.getAttribute('data-modhub-2-0-filter')

    setActiveModsFilters(filterId, e.target.checked, false, false)
}

const createModhubAccountFiltersOverlayFilterIcon = () => {
    const filterSpan = document.createElement('span')

    filterSpan.classList = 'modhub-2-0-account-mods-filters-filter-checkmark'

    filterSpan.setAttribute('data-mods-filters-element', '')

    return filterSpan
}

const createModhubAccountFiltersOverlayFilterChildIcon = () => {
    const filterChildIcon = document.createElement('div')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/angle-right.svg'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => filterChildIcon.innerHTML = result)

    filterChildIcon.classList = 'modhub-2-0-account-mods-filters-filter-arrow'

    return filterChildIcon
}

const createModhubAccountFiltersOverlayFilterChildOverlay = (filter, filterChilds) => {
    const filterChildOverlay = document.createElement('div')

    filterChildOverlay.classList = 'modhub-2-0-account-mods-filters-filter-child-overlay'

    filterChildOverlay.setAttribute('data-filter-overlay-id', filter)
    filterChildOverlay.setAttribute('data-mods-filters-element', '')
    filterChildOverlay.appendChild(createModhubAccountFiltersChildOverlayInnerContainer(filter))

    return filterChildOverlay
}

const createModhubAccountFiltersChildOverlayInnerContainer = (filter) => {
    const filterChildInnerContainer = document.createElement('div')

    filterChildInnerContainer.classList = 'modhub-2-0-account-mods-filters-overlay-inner-container'

    filterChildInnerContainer.setAttribute('data-mods-filters-element', '')

    filtersChilds[filter].forEach((filter) => {
        filterChildInnerContainer.appendChild(createModhubAccountFiltersOverlayFilterContainer(filter, null))
    })

    return filterChildInnerContainer
}

const createModhubAccountActiveFiltersContainer = () => {
    const activeFiltersContainer = document.createElement('div')

    activeFiltersContainer.id = 'modhub-2-0-active-filters'
    activeFiltersContainer.classList = 'modhub-2-0-account-mods-filters-active-container'

    return activeFiltersContainer
}

const setModhubAccountActiveFilter = (filter, isActive) => {
    isActive ? createModhubAccountActiveFilter(filter) : deleteModhubAccountActiveFilter(filter)
}

const createModhubAccountActiveFilter = (filter) => {
    const activeFiltersContainer = document.getElementById('modhub-2-0-active-filters')
    const activeFilterContainer = document.createElement('div')

    activeFilterContainer.id = `modhub-2-0-active-filter-${filter}`
    activeFilterContainer.classList = 'modhub-2-0-account-mods-filters-active-filter-container'

    activeFilterContainer.appendChild(createModhubAccountActiveFilterInnerContainer(filter))

    activeFilterContainer.addEventListener('click', () => {
        setActiveModsFilters(filter, false, false, true)
    })

    return activeFiltersContainer.appendChild(activeFilterContainer)
}

const createModhubAccountActiveFilterInnerContainer = (filter) => {
    const activeFilterInnerContainer = document.createElement('div')

    activeFilterInnerContainer.classList = 'modhub-2-0-account-mods-filters-active-filter-inner-container'

    activeFilterInnerContainer.appendChild(createModhubAccountActiveFilterIconContainer())
    activeFilterInnerContainer.appendChild(createModhubAccountActiveFilterText(filter))

    return activeFilterInnerContainer
}

const createModhubAccountActiveFilterIconContainer = () => {
    const activeFilterIconContainer = document.createElement('div')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/check.svg'

    activeFilterIconContainer.classList = 'modhub-2-0-account-mods-filters-active-filter-icon-container'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => activeFilterIconContainer.innerHTML = result)

    return activeFilterIconContainer
}

const createModhubAccountActiveFilterText = (filter) => {
    const activeFilterText = document.createElement('p')

    activeFilterText.textContent = filter

    return activeFilterText
}

const deleteModhubAccountActiveFilter = (filter) => {
    const activeFilter = document.getElementById(`modhub-2-0-active-filter-${filter}`)

    if (activeFilter !== undefined && activeFilter !== null) {
        activeFilter.remove()
    }
}

const createModhubAccountModsListContainer = (data) => {
    const modsContainer = document.createElement('div')

    modsContainer.classList = 'modhub-2-0-account-mods-list-container'

    modsContainer.appendChild(createModhubAccountModsListForm(data))

    return modsContainer
}

const createModhubAccountModsListForm = (data) => {
    const modsListForm = document.createElement('form')

    modsListForm.method = data.modsList.formMethod.toUpperCase()
    modsListForm.action = data.modsList.formAction

    modsListForm.appendChild(createModhubAccountModsListTable(data))
    modsListForm.appendChild(createModhubAccountModsListFormButtonContainer(data))

    return modsListForm
}

const createModhubAccountModsListTable = (data) => {
    const modsListTable = document.createElement('table')

    modsListTable.id = 'modhub-2-0-mods-list'
    modsListTable.classList = 'modhub-2-0-account-mods-table'

    modsListTable.appendChild(createModhubAccountModsListTableTitlesRow(data))

    for (let i = 0; i < Object.keys(data.modsList.tableMods).length; i++) {
        const modKey = Object.keys(data.modsList.tableMods)[i]

        if (modKey !== 'summary') {
            modsListTable.appendChild(createModhubAccountModsListTableModRow(data.modsList.tableMods[modKey]))
        } else {
            modsListTable.appendChild(createModhubAccountModsListTableSummaryRow(data.modsList.tableMods[modKey]))
        }
    }

    return modsListTable
}

const createModhubAccountModsListTableTitlesRow = (data) => {
    const modsListTableTitles = document.createElement('tr')

    modsListTableTitles.classList = 'modhub-2-0-account-mods-table-row'

    for (let i = 0; i < Object.keys(data.modsList.tableHeader).length; i++) {
        let title = Object.keys(data.modsList.tableHeader)[i]

        if (data.modsList.tableHeader[title].title) {
            title = data.modsList.tableHeader[title].title
        }

        modsListTableTitles.appendChild(createModhubAccountModsListTableTitle(title))
    }

    return modsListTableTitles
}

const createModhubAccountModsListTableTitle = (data) => {
    const modsListTableTitle = document.createElement('td')

    modsListTableTitle.innerHTML = data

    return modsListTableTitle
}

const createModhubAccountModsListTableModRow = (data) => {
    const modsListTableModRow = document.createElement('tr')

    modsListTableModRow.classList = 'modhub-2-0-account-mods-table-row modhub-2-0-account-mods-table-mod-row'

    const mod = createModhubAccountModsListTableMod(data.name, data.title, data.href, data.state, data.game, data.downloads, data.rating, data.active, data.top, data.update)

    mod.forEach((element) => {
        modsListTableModRow.appendChild(element)
    })

    return modsListTableModRow
}

const createModhubAccountModsListTableMod = (name, title, href, state, game, downloads, rating, isActive, isTopMod, lastUpdate) => {
    const [nameElement, stateElement, gameElement, downloadsElement, ratingElement, isActiveElement, isTopModElement, lastUpdateElement] = [document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td')]

    nameElement.title = title

    nameElement.appendChild(createModhubAccountModsListTableModName(name, href))
    stateElement.appendChild(createModhubAccountModsListTableModState(state))

    gameElement.innerHTML = game
    downloadsElement.innerHTML = downloads
    ratingElement.innerHTML = rating
    isActiveElement.innerHTML = isActive

    if (isActive === 'Yes' || isActive === 'Ja') {
        isActiveElement.classList = 'modhub-2-0-account-mods-table-active-mod'
    } else {
        isActiveElement.classList = 'modhub-2-0-account-mods-table-active-mod-no'
    }

    if (isTopMod === 'Yes' || isTopMod === 'Ja') {
        isTopModElement.classList = 'modhub-2-0-account-mods-table-active-mod'
    } else {
        isTopModElement.classList = 'modhub-2-0-account-mods-table-active-mod-no'
    }

    isTopModElement.innerHTML = isTopMod
    lastUpdateElement.innerHTML = lastUpdate

    return [nameElement, stateElement, gameElement, downloadsElement, ratingElement, isActiveElement, isTopModElement, lastUpdateElement]
}

const createModhubAccountModsListTableModName = (name, href) => {
    const modName = document.createElement('a')

    modName.href = href
    modName.textContent = name

    return modName
}

const createModhubAccountModsListTableModState = (state) => {
    const modState = document.createElement('div')
    const modStateInner = document.createElement('div')

    modStateInner.innerHTML = state
    modStateInner.classList = 'modhub-2-0-account-mods-table-mod-state-inner'

    if (state == 'New') {
        modStateInner.classList.add('modhub-2-0-account-mods-table-mod-state-new')
    }

    if (state == 'Live') {
        modStateInner.classList.add('modhub-2-0-account-mods-table-mod-state-live')
    }

    if (state == 'Pending') {
        modStateInner.classList.add('modhub-2-0-account-mods-table-mod-state-pending')
    }

    if (state == 'Review') {
        modStateInner.classList.add('modhub-2-0-account-mods-table-mod-state-review')
    }

    if (state == 'Testing') {
        modStateInner.classList.add('modhub-2-0-account-mods-table-mod-state-testing')
    }

    modState.classList = 'modhub-2-0-account-mods-table-mod-state'

    modState.appendChild(modStateInner)

    return modState
}

const createModhubAccountModsListTableSummaryRow = (data) => {
    const modsListTableSummaryRow = document.createElement('tr')

    modsListTableSummaryRow.classList = 'modhub-2-0-account-mods-table-row'

    const summary = createModhubAccountModsListTableSummary(data.mods, null, null, data.downloads, data.rating, data.active, data.top, null)

    summary.forEach((element) => {
        modsListTableSummaryRow.appendChild(element)
    })

    return modsListTableSummaryRow
}

const createModhubAccountModsListTableSummary = (name, state, game, downloads, rating, isActive, isTopMod, lastUpdate) => {
    const [nameElement, stateElement, gameElement, downloadsElement, ratingElement, isActiveElement, isTopModElement, lastUpdateElement] = [document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td'), document.createElement('td')]

    nameElement.innerHTML = name
    nameElement.id = 'modhub-2-0-mods-summary-total'

    state ? stateElement.innerHTML = state : null
    game ? gameElement.innerHTML = game : null

    downloadsElement.innerHTML = downloads
    downloadsElement.id = 'modhub-2-0-mods-summary-downloads'
    ratingElement.innerHTML = rating
    ratingElement.id = 'modhub-2-0-mods-summary-rating'
    isActiveElement.innerHTML = isActive
    isActiveElement.id = 'modhub-2-0-mods-summary-active'
    isTopModElement.innerHTML = isTopMod
    isTopModElement.id = 'modhub-2-0-mods-summary-top'

    lastUpdate ? lastUpdateElement.innerHTML = lastUpdate : null

    return [nameElement, stateElement, gameElement, downloadsElement, ratingElement, isActiveElement, isTopModElement, lastUpdateElement]
}

const createModhubAccountModsListFormButtonContainer = (data) => {
    const formButtonContainer = document.createElement('div')

    formButtonContainer.classList = 'modhub-2-0-account-mods-table-form-button-container'

    formButtonContainer.appendChild(createModhubAccountModsListFormButton(data))

    return formButtonContainer
}

const createModhubAccountModsListFormButton = (data) => {
    const formButton = document.createElement('button')

    formButton.type = data.modsList.formBtnType
    formButton.name = data.modsList.formBtnName
    formButton.value = data.modsList.formBtnValue
    formButton.textContent = data.modsList.formBtnValue

    return formButton
}

const createPaginationContainer = (data) => {
    const paginationContainer = document.createElement('div')

    paginationContainer.classList = 'modhub-2-0-pagination-container'

    paginationContainer.appendChild(createPaginationInnerContainer(data))

    return paginationContainer
}

const createPaginationInnerContainer = (data) => {
    const paginationInnerContainer = document.createElement('div')

    paginationInnerContainer.classList = 'modhub-2-0-pagination-inner-container'

    paginationInnerContainer.appendChild(createPaginationButton(data.pagination.previous))
    paginationInnerContainer.appendChild(createPaginationPagesContainer(data.pagination.pages))
    paginationInnerContainer.appendChild(createPaginationButton(data.pagination.next, true))

    return paginationInnerContainer
}

const createPaginationButton = (data, isNext) => {
    const paginationBtn = document.createElement('a')

    paginationBtn.classList = 'modhub-2-0-pagination-button'

    if (isNext) {
        paginationBtn.classList.add('modhub-2-0-pagination-button-next')
    }

    if (data.href) {
        paginationBtn.href = data.href
    } else if (data.disabled === true) {
        paginationBtn.classList.add('modhub-2-0-pagination-button-disabled')
    }

    paginationBtn.appendChild(createPaginationButtonIcon(isNext))

    return paginationBtn
}

const createPaginationButtonIcon = (isNext) => {
    const paginationButtonIcon = document.createElement('div')
    const iconUrl = 'chrome-extension://--extension-id--/src/resources/icons/angle-right.svg'

    paginationButtonIcon.classList = 'modhub-2-0-pagination-button-icon'

    fetch((iconUrl))
    .then((response) => response.text())
    .then((result) => paginationButtonIcon.innerHTML = result)

    if (!isNext) {
        paginationButtonIcon.style.rotate = '180deg'
    }

    return paginationButtonIcon
}

const createPaginationPagesContainer = (data) => {
    const paginationPagesContainer = document.createElement('div')

    paginationPagesContainer.classList = 'modhub-2-0-pagination-pages-container'

    for (let i = 0; i < Object.keys(data).length; i++) {
        paginationPagesContainer.appendChild(createPaginationPageButton(data[i]))
    }

    return paginationPagesContainer
}

const createPaginationPageButton = (data) => {
    const paginationPageButton = document.createElement('a')

    paginationPageButton.textContent = data.page
    paginationPageButton.classList = 'modhub-2-0-pagination-page-button modhub-2-0-font'

    if (data.href) {
        paginationPageButton.href = data.href
    } else {
        if (data.current !== true) {
            paginationPageButton.classList.add('modhub-2-0-pagination-page-button-disabled')
        }
    }

    if (data.current === true) {
        paginationPageButton.classList.add('modhub-2-0-pagination-page-button-current')
    }

    return paginationPageButton
}

const createFooterDescContainer = (data) => {
    const footerDescContainer = document.createElement('div')

    footerDescContainer.innerHTML = data
    footerDescContainer.classList = 'modhub-2-0-footer-desc-container modhub-2-0-font'

    return footerDescContainer
}

const initFeaturedImagesAnimation = () => {
    const featuredImages = [...document.getElementById('modhub-2-0-featured-info-images').children]

    let increment = 0

    featuredImages[1].classList.add('modhub-2-0-featured-info-image-hide')

    setInterval(() => {
        if (increment < 1) {
            increment = increment + 1
        } else {
            increment = 0
        }

        featuredImages.forEach((image, index) => {
            image.classList.toggle('modhub-2-0-featured-info-image-hide', increment !== index)
        })

    }, 10000)
}

const setActiveModsFilters = (filter, isActive, isLoading, isUpdate) => {
    if (filter !== null && isActive !== null) {
        activeFilters[filter] = isActive

        setModhubAccountActiveFilter(filter, isActive)

        localStorage.setItem('activeFilters', JSON.stringify(activeFilters))
    }

    if (localStorage.getItem('activeFilters') == null) {
        const tempFilters = {}

        for (let i = 0; i < Object.keys(filtersChilds).length; i++) {
            const filterChild = filtersChilds[Object.keys(filtersChilds)[i]]

            if (filterChild === null) {
                tempFilters[Object.keys(filtersChilds)[i]] = false
            } else {
                filterChild.forEach((filter) => {
                    tempFilters[filter] = false
                })
            }
        }

        localStorage.setItem('activeFilters', JSON.stringify(tempFilters))
    }

    activeFilters = JSON.parse(localStorage.getItem('activeFilters'))

    for (let i = 0; i < Object.keys(activeFilters).length; i++) {
        const filter = Object.keys(activeFilters)[i]

        if (isLoading) {
            setModhubAccountActiveFilter(filter, activeFilters[filter])
        }
    }

    if (isUpdate) {
        const filterCheckbox = document.querySelector(`[data-modhub-2-0-filter='${filter}']`)

        if (filterCheckbox) {
            if (filterCheckbox.checked !== isActive) {
                filterCheckbox.checked = isActive
            }
        }
    }

    filterModsList()
}

const filterModsList = () => {
    const filtersRoot = document.getElementById('modhub-2-0-mods-list')
    const filtersTarget = [...filtersRoot.children]

    let currentFilters = []

    for (let i = 0; i < Object.keys(activeFilters).length; i++) {
        const filter = Object.keys(activeFilters)[i]

        if (activeFilters[filter] === true) {
            currentFilters.push(filter)
        }
    }

    filtersTarget.forEach((row) => {
        if (row.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            const columns = [...row.children]

            row.style.display = ''

            filtersRoot.setAttribute('data-is-filtered', false)

            columns.forEach((column, index) => {
                currentFilters.forEach((filter) => {
                    const filterColumn = getFilterDependingColumnIndex(filter)

                    if (index === filterColumn) {
                        if (filter !== 'Active' && filter !== 'Top') {
                            if (column.textContent !== filter) {
                                row.style.display = 'none'

                                filtersRoot.setAttribute('data-is-filtered', true)
                            }
                        } else if (column.textContent !== 'Yes' && column.textContent !== 'Ja') {
                            row.style.display = 'none'

                            filtersRoot.setAttribute('data-is-filtered', true)
                        }
                    }
                })
            })
        }
    })

    setModhubAccountModsListTableRowHighlited()
    updateModhubAccountModsListTableSummaryRow()
}

const setModhubAccountModsListTableRowHighlited = () => {
    const tableRoot = document.getElementById('modhub-2-0-mods-list').children
    let tableRows = []

    for (let i = 0; i < Object.keys(tableRoot).length; i++) {
        const tableRow = tableRoot[i]

        if (window.getComputedStyle(tableRow).display !== 'none') {
            tableRows.push(tableRow)
        }
    }

    if (tableRows.length > 0) {
        tableRows.forEach((element, index) => {
            index % 2 ? element.classList.add('modhub-2-0-account-mods-table-mod-row-highlited') : element.classList.remove('modhub-2-0-account-mods-table-mod-row-highlited')
        })
    }
}

const updateModhubAccountModsListTableSummaryRow = () => {
    updateModhubAccountModsListTableSummaryTotalMods()
    updateModhubAccountModsListTableSummaryDownloads()
    updateModhubAccountModsListTableSummaryRating()
    updateModhubAccountModsListTableSummaryActive()
    updateModhubAccountModsListTableSummaryTop()
}

const updateModhubAccountModsListTableSummaryTotalMods = () => {
    const summaryId = document.getElementById('modhub-2-0-mods-summary-total')

    summaryId.textContent = summaryId.textContent.replace(summaryId.textContent.slice(summaryId.textContent.match(/\d+/).index, summaryId.textContent.match(/\d+/).index + summaryId.textContent.match(/\d+/)[0].length), getTotalModsCount().toString())
}

const getTotalModsCount = () => {
    const modsRoot = [...document.getElementById('modhub-2-0-mods-list').children]

    let totalCount = 0

    modsRoot.forEach((mod) => {
        if (mod.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            if (window.getComputedStyle(mod).display !== 'none') {
                totalCount = totalCount + 1
            }
        }
    })

    return totalCount
}

const updateModhubAccountModsListTableSummaryDownloads = () => {
    const summaryId = document.getElementById('modhub-2-0-mods-summary-downloads')

    summaryId.textContent = getTotalModsDownloads()
}

const getTotalModsDownloads = () => {
    const modsRoot = [...document.getElementById('modhub-2-0-mods-list').children]

    let totalDownloads = 0

    modsRoot.forEach((mod) => {
        if (mod.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            const modDownloadsColumn = mod.children[3].textContent

            if (window.getComputedStyle(mod).display !== 'none') {
                totalDownloads = totalDownloads + parseInt(modDownloadsColumn)
            }
        }
    })

    return totalDownloads.toString()
}

const updateModhubAccountModsListTableSummaryRating = () => {
    const summaryId = document.getElementById('modhub-2-0-mods-summary-rating')

    summaryId.textContent = getTotalModsRating()
}

const getTotalModsRating = () => {
    const modsRoot = [...document.getElementById('modhub-2-0-mods-list').children]

    let totalRating = 0

    modsRoot.forEach((mod) => {
        if (mod.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            const modRatingColumn = mod.children[4].textContent

            if (window.getComputedStyle(mod).display !== 'none') {
                totalRating = totalRating + parseFloat(modRatingColumn)
            }
        }
    })

    return totalRating !== 0 ? (Math.round(((totalRating / getTotalModsCountWithRating()) + Number.EPSILON) * 100) / 100).toString() : 0
}

const getTotalModsCountWithRating = () => {
    const modsRoot = [...document.getElementById('modhub-2-0-mods-list').children]

    let totalCount = 0

    modsRoot.forEach((mod) => {
        if (mod.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            if (window.getComputedStyle(mod).display !== 'none') {
                if (parseFloat(mod.children[4].textContent) !== 0) {
                    totalCount = totalCount + 1
                }
            }
        }
    })

    return totalCount
}

const updateModhubAccountModsListTableSummaryActive = () => {
    const summaryId = document.getElementById('modhub-2-0-mods-summary-active')

    summaryId.textContent = getTotalModsActive()
}

const getTotalModsActive = () => {
    const modsRoot = [...document.getElementById('modhub-2-0-mods-list').children]

    let totalActive = 0

    modsRoot.forEach((mod) => {
        if (mod.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            const modActiveColumn = mod.children[5].textContent

            if (window.getComputedStyle(mod).display !== 'none') {
                if (modActiveColumn === 'Yes' || modActiveColumn === 'Ja') {
                    totalActive = totalActive + 1
                }
            }
        }
    })

    return totalActive.toString()
}

const updateModhubAccountModsListTableSummaryTop = () => {
    const summaryId = document.getElementById('modhub-2-0-mods-summary-top')

    summaryId.textContent = getTotalModsTop()
}

const getTotalModsTop = () => {
    const modsRoot = [...document.getElementById('modhub-2-0-mods-list').children]

    let totalTop = 0

    modsRoot.forEach((mod) => {
        if (mod.classList.contains('modhub-2-0-account-mods-table-mod-row')) {
            const modTopColumn = mod.children[6].textContent

            if (window.getComputedStyle(mod).display !== 'none') {
                if (modTopColumn === 'Yes' || modTopColumn === 'Ja') {
                    totalTop = totalTop + 1
                }
            }
        }
    })

    return totalTop.toString()
}

const getIsModsFilterActive = (filter) => {
    const activeFilters = JSON.parse(localStorage.getItem('activeFilters'))

    if (activeFilters === undefined || activeFilters === null) {
        return false
    }

    for (let i = 0; i < Object.keys(activeFilters).length; i++) {
        const filterKey = Object.keys(activeFilters)[i]

        if (filterKey === filter) {
            return activeFilters[filterKey]
        }
    }
}

const getFilterDependingColumnIndex = (filter) => {
    const filtersColumns = [null, ['New', 'Live', 'Pending', 'Review', 'Testing'], ['FS22', 'FS19'], null, null, 'Active', 'Top', null]

    let filterColumn

    filtersColumns.forEach((column, index) => {
        if (column !== null) {
            if (Array.isArray(column)) {
                column.forEach((columnFilter) => {
                    if (columnFilter === filter) {
                        filterColumn = index
                    }
                })
            } else {
                if (column === filter) {
                    filterColumn = index
                }
            }
        }
    })

    return filterColumn
}

const getChildrenElementByTagAndClass = (parentElement, tag, className) => {
    const parent = [...parentElement.children]

    let foundElement = null

    parent.forEach((element) => {
        if (element.tagName === tag.toUpperCase()) {
            if (className !== undefined) {
                if (element.classList.contains(className)) {
                    foundElement = element
                }
            }
        }
    })

    return foundElement
}

const convertUpperCaseStringToFirstCharUpperCase = (string) => {
    return string.slice(0, 1) + string.slice(string.indexOf(string.slice(0, 1)) + 1).toLowerCase()
}

const swapArrayElementByIndexes = (array, from, to) => {
    const temp = array[to]

    array[to] = array[from]

    array[from] = temp
}

init()
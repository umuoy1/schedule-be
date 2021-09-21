const JSSoup = require("jssoup").default
const fs = require('fs')

module.exports = function (html) {
    const soup = new JSSoup(html)
    const user = soup.find('div', {
        'id': 'Top1_divLoginName'
    }).findNextSibling().contents[0]._text

    const tbody = soup.find('table', {
        'id': 'kbtable'
    }).contents

    const weekMap = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const dayCourses = {}
    weekMap.forEach((e, v) => {
        dayCourses[e] = []
    })

    for (let i = 1; i <= 6; i++) {
        const section = tbody[i].contents
        for (let day = 1; day <= 7; day++) {
            const cell = section[day].find('div', {
                'class': 'kbcontent'
            })
            const courses = analyzeCell(i, cell)
            dayCourses[weekMap[day - 1]] = dayCourses[weekMap[day - 1]].concat(courses)
        }
    }
    return {
        class_name: user,
        ...dayCourses
    }
}

function analyzeCell(i, cell) {
    const all = cell.findAll('font')
    const courses = []
    const num = all.length
    cell.contents.forEach((e, v) => {
        if (e._text && e._text !== '---------------------' && e._text !== '&nbsp;') {
            const course = {
                course_name: e._text,
                section: `${i}`
            }
            courses.push(course)
        }
    })

    for (let i = 0; i < num; i++) {
        const map = ['teacher', 'week', 'class_room']
        courses[Math.floor(i / 3)][map[i % 3]] = all[i].contents[0]._text
    }

    courses.forEach((v, i) => {
        courses[i].week_array = analyzeWeek(v.week)
    })

    return courses
}

function analyzeWeek(week) {
    const days = []
    week.slice(0, week.length - 3).split(',').forEach((v, i) => {
        const index = v.indexOf('-')
        if (index !== -1) {
            const start = v.slice(0, index)
            const end = v.slice(index + 1, v.length)
            for (let i = start; i <= end; i++) {
                days.push(`${i}`)
            }
        } else {
            days.push(v)
        }
    })
    return days
}
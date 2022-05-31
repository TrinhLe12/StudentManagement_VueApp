export const CommonService ={

    ClearForm (form, vuelidateInstance) {
        for (var field in form) {
            form[field] = ''
        }

        vuelidateInstance.$reset()

    },

    ConvertToDecimal (value) {
        if (value == null || value == undefined || value == "") {
            return null
        } else {
            return parseFloat(value)
        }
    }, 

    GetCurrentUserInfo (currentUser) {
        const user = JSON.parse(localStorage.getItem('currentUser'))
        if (user != null && user != undefined) {
          currentUser.identityId = user.identityId
          currentUser.userRole = user.userRole
        } else {
          currentUser.userRole = []
        }
    },

    ConvertToDeptOptions (departments) {
        let options = []
        options.push({value: '', text: "Select Department"})
        departments.forEach(d => {
          options.push({ value: d.deptId, text: d.deptName })
        })
        return options
    },

    ConvertToClassOptions (classes) {
        let options = []
        options.push({value: '', text: "Select Class"})
        classes.forEach(c => {
          options.push({ value: c.classId, text: c.className })
        })
        return options
    },

    ConvertToStudentOptions (students) {
        let options = []
        options.push({value: '', text: "Select Student"})
        students.forEach(s => {
          options.push({ value: s.userId, text: s.userName })
        })
        return options
    },

    ConvertToSubjectOptions (subjects) {
        let options = []
        options.push({value: '', text: "Select Subject"})
        subjects.forEach(s => {
          options.push({ value: s.subjectId, text: s.subjectName })
        })
        return options
    },

    ConvertToSemesterOptions (semesters) {
        let options = []
        options.push({value: '', text: "Select Semester"})
        semesters.forEach(s => {
          options.push({ value: s.semesterId, text: s.semesterName })
        })
        return options
    },

    GetYearOptions () {
        const currentYear = new Date().getFullYear()
        const minYear = currentYear - 20
        let options = []
        options.push({value: '', text: "Select Year"})
        for (var i = minYear; i <= currentYear; i++) {
          options.push({ value: i, text: i })
        }
        return options
    },

}
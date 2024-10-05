<template>
  <!-- TODO: Load selections from local storage -->
  <div class="relative mt-20 mb-20 max-w-screen-sm left-1/2 -translate-x-1/2">
    <div class="px-12">
      <h2><span class="font-bold">Khanh</span>, build your sleep profile</h2>
      <p>This will help us make personalised recommendations. Tell us what you have trouble with.</p>
    </div>
    <div class="flex flex-col gap-0 py-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="problem-category-container relative flex flex-col align-center justify-center pointer-none text-xl border-gray-300 bg-sky-300 text-slate-900 p-4 hover:border-slate-400 hover:bg-sky-300/75">
          <div class="problem-category font-normal hover:text-slate-800">{{ sleepProblems.find(item => item.id === 'beforeSleep').name }}</div>
          <div>
            <div class="text-sm">{{ sleepProblems.find(item => item.id === 'beforeSleep').suffix}}...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span @click="editProblemProfile(problem.label)" v-for="problem in sleepProblems.find(item => item.id === 'beforeSleep').problems" :key="problem" class="problem inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-sky-900 px-4 ring-1 ring-inset ring-sky-100 bg-sky-200 hover:bg-sky-200/75">
                <div>{{ problem.label }}</div>
                <div class="text-2xl">+</div>
                <div class="text-2xl hidden">&#10003;</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="problem-category-container relative flex flex-col align-center justify-center text-xl border-gray-300 bg-indigo-300 text-slate-900 p-4 hover:border-slate-400 hover:bg-indigo-300/75">
          <div class="problem-category font-normal hover:text-slate-800">{{ sleepProblems.find(item => item.id === 'duringSleep').name }}</div>
          <div>
            <div class="text-sm">{{ sleepProblems.find(item => item.id === 'duringSleep').suffix}}...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span @click="editProblemProfile(problem.label)" v-for="problem in sleepProblems.find(item => item.id === 'duringSleep').problems" :key="problem" class="problem inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-indigo-900 px-4 ring-1 ring-inset ring-indigo-100 bg-indigo-200 hover:bg-indigo-200/75">
                <div>{{ problem.label }}</div>
                <div class="text-2xl">+</div>
                <div class="text-2xl hidden">&#10003;</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="problem-category-container relative flex flex-col align-center justify-center text-xl border-gray-300 bg-orange-300 text-slate-900 p-4 hover:border-slate-400 hover:bg-orange-300/75">
          <div class="problem-category font-normal hover:text-slate-800">{{ sleepProblems.find(item => item.id === 'afterSleep').name }}</div>
          <div>
            <div class="text-sm">{{ sleepProblems.find(item => item.id === 'afterSleep').suffix}}...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span @click="editProblemProfile(problem.label)" v-for="problem in sleepProblems.find(item => item.id === 'afterSleep').problems" :key="problem" class="problem inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-orange-900 px-4 ring-1 ring-inset ring-orange-100 bg-orange-200 hover:bg-orange-200/75">
                <div>{{ problem.label }}</div>
                <div class="text-2xl">+</div>
                <div class="text-2xl hidden">&#10003;</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4">
        <div class="problem-category-container relative flex flex-col align-center justify-center text-xl border-gray-300 bg-amber-200 text-slate-900 p-4 hover:border-slate-400 hover:bg-amber-200/75">
          <div class="problem-category font-normal hover:text-slate-800">{{ sleepProblems.find(item => item.id === 'duringDay').name }}</div>
          <div>
            <div class="text-sm">{{ sleepProblems.find(item => item.id === 'duringDay').suffix}}...</div>
            <div class="flex flex-wrap justify-center gap-2 mt-2">
              <span @click="editProblemProfile(problem.label)" v-for="problem in sleepProblems.find(item => item.id === 'duringDay').problems" :key="problem" class="problem inline-flex align-center items-center gap-x-2 rounded-full cursor-pointer text-sm text-amber-900 px-4 ring-1 ring-inset ring-amber-50 bg-amber-100 hover:bg-amber-100/75">
                <div>{{ problem.label }}</div>
                <div class="text-2xl">+</div>
                <div class="text-2xl hidden">&#10003;</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-12">
      {{ this.sleepProfileProblems }}
      <!-- I have trouble with <span class="underline decoration-dotted">getting to sleep within 20 minutes</span> and <span class="underline decoration-dotted">because I snore</span>. -->
    </div>
    <button @click="goNext">Submit</button>
  </div>
</template>

<script>
export default {
  name: 'ProblemSelection',
  data() { 
    return {
      sleepProfileProblems: "",
      sleepProblems: [
        {
          id: "beforeSleep",
          name: "Getting to sleep",
          suffix: "Because I",
          problems: [
            {
              label: "Can't fall asleep quickly",
              selected: false,
            },
            {
              label: "Have difficulty breathing",
              selected: false,
            },
          ],
        },
        {
          id: "duringSleep",
          name: "Sleeping",
          suffix: "Because I",
          problems: [
            {
              label: "Snore",
              selected: false,
            },
            {
              label: "Wake up a lot",
              selected: false,
            },
            {
              label: "Gasp for air",
              selected: false,
            },
            {
              label: "Stop breathing",
              selected: false,
            },
          ],
        },
        {
          id: "afterSleep",
          name: "Waking up",
          suffix: "Because I",
          problems: [
            {
              label: "Don't feel rested",
              selected: false,
            },
            {
              label: "Wake up late",
              selected: false,
            },
            {
              label: "Sleep through my alarms",
              selected: false,
            },
            {
              label: "Get a headache",
              selected: false,
            },
            {
              label: "Have a dry mouth",
              selected: false,
            },
            {
              label: "Wake too early and can't sleep again",
              selected: false,
            },
            {
              label: "Find it hard to get out of bed",
              selected: false,
            },
          ],
        },
        {
          id: "duringDay",
          name: "During the day",
          suffix: "I",
          problems: [
            {
              label: "Feel tired",
              selected: false,
            },
            {
              label: "Experience microsleeps",
              selected: false,
            },
            {
              label: "Find it hard to focus",
              selected: false,
            },
            {
              label: "Causing accidents",
              selected: false,
            },
            {
              label: "Have sleep anxiety",
              selected: false,
            },
            {
              label: "Am stressed",
              selected: false,
            },
          ],
        },
      ]
    }
  },
  methods: {
    goNext() {
      this.$router.push('/reco')
    },
    firstLetterLowerCase(string) {
      if (string.length <= 1) return string
      return string.charAt(0).toLowerCase() + string.slice(1);
    },
    editProblemProfile(selectedProblemLabel) {
      console.log(this.sleepProblems)
      console.log("LABEL:", selectedProblemLabel)

      // Update text by going through and selecting problems from each category.
      const categories = document.getElementsByClassName("problem-category-container")
      for (let i = 0; i < categories.length; i++) {
        let category = categories.item(i)
        let categoryName = category.getElementsByClassName("problem-category")[0].textContent
        console.log(categoryName)
        let problems = category.getElementsByClassName("problem")
        for (let j = 0; j < problems.length; j++) {
          let problem = problems.item(j)
          let problemLabel = problem.getElementsByTagName('div')[0].textContent
          let problemLabelPlus = problem.getElementsByTagName('div')[1]
          let problemLabelTick = problem.getElementsByTagName('div')[2]
          console.log(problemLabel)
          if (problemLabel === selectedProblemLabel) {
            console.log("ONE MATCH FOUND:", problemLabel)
            // Determine if we are selecting or unselecting
            if (!problem.classList.contains("problem-selected")) {
              // Add problem-selected class and change icon
              problem.classList.add("problem-selected")
              problemLabelPlus.classList.add("hidden")
              problemLabelTick.classList.remove("hidden")
              this.sleepProblems
                .find(item => item.name === categoryName).problems
                .find(item => item.label === problemLabel).selected = true
            } else {
              // Remove problem-selected class and change icon
              problem.classList.remove("problem-selected")
              problemLabelPlus.classList.remove("hidden")
              problemLabelTick.classList.add("hidden")
              this.sleepProblems
                .find(item => item.name === categoryName).problems
                .find(item => item.label === problemLabel).selected = false
            }
          }
          // Build sleep profile string
          // I have trouble
          // CATEGORY_X because I
          // PROBLEM_1, PROBLEM_2, and PROBLEM_3 // array.map(String).join(',');
          // ; and
          // CATEGORY_Y because I
          // PROBLEM_1, PROBLEM_2, and PROBLEM_3
          // .
          this.sleepProfileProblems = "I have trouble "
          let categorySegments = []
          for (const category of this.sleepProblems) {
            // let categorySegment = ""
            // if category contains selected problems, concat category
            let selectedProblems = []
            for (const problem of category.problems) {
              if (problem.selected) selectedProblems.push(this.firstLetterLowerCase(problem.label))
            }
            if (selectedProblems.length) categorySegments.push(''.concat(this.firstLetterLowerCase(category.name), ' ', this.firstLetterLowerCase(category.suffix), ' ', selectedProblems.map(String).join(', ')))
          }
          this.sleepProfileProblems = this.sleepProfileProblems.concat(categorySegments.map(String).join('; and '), '.')

          // Update selections in local storage
          localStorage.setItem("sleepProblems", JSON.stringify(this.sleepProblems))
          localStorage.setItem("sleepProfileProblems", JSON.stringify(this.sleepProfileProblems))
        }
      }
      console.log(this.sleepProfileProblems)
      console.log(this.sleepProblems)
    }
  },
  beforeMount() {
    // if (localStorage.getItem("sleepProblems") !== null) {
    //   this.sleepProblems = JSON.parse(localStorage.getItem("sleepProblems"))
    // }
  }
}
</script>
class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body);
        
        if (locationData.OnAcquire) {
            Object.assign(this.engine.storyData, locationData.OnAcquire); // Update the story state based on actions
        }

        // Handle normal choices
        if (locationData.Choices) {
            locationData.Choices.forEach(choice => {
                if (!choice.RequiresKey || (choice.RequiresKey && this.engine.storyData.HasKey)) {
                    this.engine.addChoice(choice.Text, choice);
                }
            });
        }

        // Handle gate choices if the key is available
        if (this.engine.storyData.HasKey && locationData.ChoicesGate) {
            locationData.ChoicesGate.forEach(choice => {
                this.engine.addChoice(choice.Text, choice);
            });
        }

        if (!locationData.Choices && !locationData.ChoicesGate) {
            this.engine.addChoice("The end.", null);
        }

        /*
        if(locationData.Choices && locationData.Choices.length > 0) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
                if (locationData.key = 1) {
                    this.engine.addChoice(choice.Text, choiceGate);
                }
            }
        } else {
            this.engine.addChoice("The end.", null)
        }
        */
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
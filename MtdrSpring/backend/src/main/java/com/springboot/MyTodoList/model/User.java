package com.springboot.MyTodoList.model;

public class User {
    int id;
    String username;
    String email;
    int teamId;

    public User(Builder builder) {
        this.id = builder.id;
        this.username = builder.username;
        this.email = builder.email;
        this.teamId = builder.teamId;
    }

    public static class Builder {
        int id;
        String username;
        String email;
        int teamId;

        public Builder setId(int id) {
            this.id = id;
            return this;
        }

        public Builder setUsername(String username) {
            this.username = username;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setTeamId(int teamId) {
            this.teamId = teamId;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}
